import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) {
    return NextResponse.json(
      { error: "place_id parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id,
          key: process.env.GOOGLE_PLACES_API_KEY,
          fields: "geometry,formatted_address",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
