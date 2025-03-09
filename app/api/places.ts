import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY; // Use the server-side key
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input } = req.query;
  if (!input) {
    return res.status(400).json({ error: "Missing input parameter" });
  }

  try {
    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        input,
        key: GOOGLE_PLACES_API_KEY,
        types: "geocode",
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
