import axios from "axios";

interface PlaceSuggestion {
  place_id: string;
  description: string;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export const getPlaceSuggestions = async (
  input: string
): Promise<PlaceSuggestion[]> => {
  if (!input) return [];

  try {
    const response = await axios.get(`/api/places/autocomplete`, {
      params: { input },
    });

    return response.data.predictions.map((place: any) => ({
      place_id: place.place_id,
      description: place.description,
    }));
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string
): Promise<Location | null> => {
  try {
    const response = await axios.get(`/api/places/details`, {
      params: { place_id: placeId },
    });

    const result = response.data.result;
    if (result && result.geometry && result.geometry.location) {
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        address: result.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};
