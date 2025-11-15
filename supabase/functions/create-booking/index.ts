import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateBookingRequest {
  carId: string;
  startDatetime: string;
  endDatetime: string;
  pickupLocation: string;
  dropoffLocation: string;
  addons?: string[];
  promoCode?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      carId,
      startDatetime,
      endDatetime,
      pickupLocation,
      dropoffLocation,
      addons = [],
      promoCode
    }: CreateBookingRequest = await req.json();

    // Validation
    if (!carId || !startDatetime || !endDatetime || !pickupLocation || !dropoffLocation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);

    if (endDate <= startDate) {
      return new Response(
        JSON.stringify({ error: 'End date must be after start date' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Fetch car details
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*, agency:agencies(id, name)')
      .eq('id', carId)
      .eq('active', true)
      .single();

    if (carError || !car) {
      console.error('Car fetch error:', carError);
      return new Response(
        JSON.stringify({ error: 'Car not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check availability - no overlapping bookings
    const { data: conflictingAvailability } = await supabase
      .from('car_availability')
      .select('*')
      .eq('car_id', carId)
      .in('status', ['booked', 'blocked'])
      .or(`start_date.lte.${endDatetime},end_date.gte.${startDatetime}`);

    if (conflictingAvailability && conflictingAvailability.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Car not available for selected dates' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate pricing using the price calculation logic
    const basePrice = car.price_per_day * days;
    let addonsPrice = 0;
    const addonData: string[] = [];

    if (addons.length > 0) {
      const { data: fetchedAddons, error: addonsError } = await supabase
        .from('addons')
        .select('*')
        .in('id', addons)
        .eq('active', true);

      if (!addonsError && fetchedAddons) {
        for (const addon of fetchedAddons) {
          addonsPrice += addon.price_per_day * days;
          addonData.push(addon.name);
        }
      }
    }

    const subtotal = basePrice + addonsPrice;
    let discountAmount = 0;

    // Apply promo code
    if (promoCode) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (promo) {
        const now = new Date();
        const validStart = !promo.starts_at || new Date(promo.starts_at) <= now;
        const validEnd = !promo.ends_at || new Date(promo.ends_at) >= now;
        const withinUsageLimit = !promo.usage_limit || promo.usage_count < promo.usage_limit;

        if (validStart && validEnd && withinUsageLimit) {
          if (promo.discount_type === 'percent') {
            discountAmount = Math.floor(subtotal * (promo.discount_value / 100));
          } else {
            discountAmount = promo.discount_value;
          }

          // Increment usage count
          await supabase
            .from('promo_codes')
            .update({ usage_count: promo.usage_count + 1 })
            .eq('id', promo.id);
        }
      }
    }

    const afterDiscount = subtotal - discountAmount;
    const taxes = Math.floor(afterDiscount * 0.18);
    const totalAmount = afterDiscount + taxes;
    const depositAmount = Math.floor(totalAmount * 0.2);

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        car_id: carId,
        agency_id: car.agency.id,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        addons: JSON.stringify(addonData),
        days,
        base_price: basePrice,
        addons_price: addonsPrice,
        taxes,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        deposit_amount: depositAmount,
        currency: 'INR',
        promo_code: promoCode?.toUpperCase() || null,
        status: 'pending',
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Failed to create booking', details: bookingError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Block availability for 15 minutes while payment is processed
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await supabase
      .from('car_availability')
      .insert({
        car_id: carId,
        start_date: startDatetime,
        end_date: endDatetime,
        status: 'blocked',
        booking_id: booking.id,
        expires_at: expiresAt.toISOString()
      });

    return new Response(
      JSON.stringify({
        booking: {
          id: booking.id,
          status: booking.status,
          totalAmount: totalAmount / 100,
          depositAmount: depositAmount / 100,
          currency: 'INR',
          expiresAt: expiresAt.toISOString()
        },
        message: 'Booking created. Complete payment within 15 minutes.'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-booking function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
