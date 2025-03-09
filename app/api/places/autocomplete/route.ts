// app/api/places/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('input');
  
  if (!input) {
    return NextResponse.json({ error: 'Input parameter is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          key: process.env.GOOGLE_PLACES_API_KEY,
          types: 'geocode',
        },
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch place suggestions' }, { status: 500 });
  }
}