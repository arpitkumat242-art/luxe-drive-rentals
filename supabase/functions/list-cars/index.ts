import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Parse query parameters
    const transmission = searchParams.get('transmission'); // 'automatic' | 'manual'
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null;
    const seats = searchParams.get('seats') ? parseInt(searchParams.get('seats')!) : null;
    const fuelType = searchParams.get('fuelType');
    const search = searchParams.get('search'); // Full-text search
    const sortBy = searchParams.get('sortBy') || 'price_asc'; // price_asc, price_desc, rating_desc
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('cars')
      .select('*, agency:agencies(id, name, rating_avg)', { count: 'exact' })
      .eq('active', true);

    // Apply filters
    if (transmission) {
      query = query.eq('transmission', transmission);
    }

    if (minPrice !== null) {
      query = query.gte('price_per_day', minPrice * 100); // Convert to paise
    }

    if (maxPrice !== null) {
      query = query.lte('price_per_day', maxPrice * 100);
    }

    if (seats !== null) {
      query = query.gte('seats', seats);
    }

    if (fuelType) {
      query = query.eq('fuel_type', fuelType);
    }

    // Full-text search
    if (search) {
      query = query.textSearch('model', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.order('price_per_day', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price_per_day', { ascending: false });
        break;
      case 'rating_desc':
        query = query.order('rating_avg', { ascending: false });
        break;
      default:
        query = query.order('price_per_day', { ascending: true });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: cars, error, count } = await query;

    if (error) {
      console.error('Error fetching cars:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch cars' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format response
    const formattedCars = cars?.map(car => ({
      id: car.id,
      model: car.model,
      make: car.make,
      year: car.year,
      seats: car.seats,
      luggage: car.luggage,
      transmission: car.transmission,
      fuelType: car.fuel_type,
      features: car.features,
      pricePerDay: car.price_per_day / 100, // Convert to rupees
      currency: car.currency,
      images: car.images,
      ratingAvg: car.rating_avg,
      ratingCount: car.rating_count,
      agency: car.agency
    })) || [];

    return new Response(
      JSON.stringify({
        cars: formattedCars,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in list-cars function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
