import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceCalculationRequest {
  carId: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  addons?: string[]; // addon IDs
  promoCode?: string;
}

interface PriceBreakdown {
  days: number;
  basePrice: number;
  addonsPrice: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  taxes: number;
  taxPercent: number;
  deposit: number;
  depositPercent: number;
  totalAmount: number;
  currency: string;
  breakdown: {
    carPricePerDay: number;
    carTotal: number;
    addons: Array<{
      name: string;
      pricePerDay: number;
      total: number;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const {
      carId,
      start,
      end,
      addons = [],
      promoCode
    }: PriceCalculationRequest = await req.json();

    // Validation
    if (!carId || !start || !end) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: carId, start, end' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

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
      .select('price_per_day, currency')
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

    // Calculate base price (prices in DB are in paise)
    const basePrice = car.price_per_day * days;

    // Fetch addons if provided
    let addonsPrice = 0;
    const addonBreakdown: Array<{name: string; pricePerDay: number; total: number}> = [];

    if (addons.length > 0) {
      const { data: fetchedAddons, error: addonsError } = await supabase
        .from('addons')
        .select('id, name, price_per_day')
        .in('id', addons)
        .eq('active', true);

      if (!addonsError && fetchedAddons) {
        for (const addon of fetchedAddons) {
          const addonTotal = addon.price_per_day * days;
          addonsPrice += addonTotal;
          addonBreakdown.push({
            name: addon.name,
            pricePerDay: addon.price_per_day / 100, // Convert to rupees for display
            total: addonTotal / 100
          });
        }
      }
    }

    // Calculate subtotal
    const subtotal = basePrice + addonsPrice;

    // Apply promo code if provided
    let discount = 0;
    let discountPercent = 0;

    if (promoCode) {
      const { data: promo, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (!promoError && promo) {
        // Check validity
        const now = new Date();
        const validStart = !promo.starts_at || new Date(promo.starts_at) <= now;
        const validEnd = !promo.ends_at || new Date(promo.ends_at) >= now;
        const withinUsageLimit = !promo.usage_limit || promo.usage_count < promo.usage_limit;

        if (validStart && validEnd && withinUsageLimit) {
          if (promo.discount_type === 'percent') {
            discountPercent = promo.discount_value;
            discount = Math.floor(subtotal * (promo.discount_value / 100));
          } else if (promo.discount_type === 'fixed') {
            discount = promo.discount_value;
          }
        }
      }
    }

    // Calculate taxes (18% GST on amount after discount)
    const taxPercent = 18;
    const afterDiscount = subtotal - discount;
    const taxes = Math.floor(afterDiscount * (taxPercent / 100));

    // Calculate total
    const totalAmount = afterDiscount + taxes;

    // Calculate deposit (20% of total)
    const depositPercent = 20;
    const deposit = Math.floor(totalAmount * (depositPercent / 100));

    const response: PriceBreakdown = {
      days,
      basePrice: basePrice / 100, // Convert to rupees
      addonsPrice: addonsPrice / 100,
      subtotal: subtotal / 100,
      discount: discount / 100,
      discountPercent,
      taxes: taxes / 100,
      taxPercent,
      deposit: deposit / 100,
      depositPercent,
      totalAmount: totalAmount / 100,
      currency: car.currency || 'INR',
      breakdown: {
        carPricePerDay: car.price_per_day / 100,
        carTotal: basePrice / 100,
        addons: addonBreakdown
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in calculate-price function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
