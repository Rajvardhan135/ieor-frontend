import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
import { getPlaceSuggestions, getPlaceDetails } from '@/utils/maps.utils';
import { Sheet } from 'react-modal-sheet';
import { addSourceAddress, addDestinationAddress } from '@/utils/api.utils';

// Use LoadScriptOnce to prevent multiple script loads
const MapSheet = ({ isOpen, setOpen, type }: any) => {
    const [searchInput, setSearchInput] = useState<any>('');
    const [suggestions, setSuggestions] = useState<any>([]);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 25.276987, lng: 55.296249 }); // Default to Dubai
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [floor, setFloor] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const suggestionRef = useRef(null);
    
    // Store the script's loaded state in a ref to prevent re-renders
    const googleMapsLoaded = useRef(false);

    // Map container style
    const containerStyle = {
        width: '100%',
        height: '600px'
    };

    // Handle search input changes
    const handleSearchInputChange = async (e: any) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.length > 2) {
            const places = await getPlaceSuggestions(value);
            setSuggestions(places);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Extract city and country from address
    const extractCityAndCountry = (address: string) => {
        const parts = address.split(",").map((part) => part.trim());

        // Assuming the last part is always the country and the second last is the city
        const country = parts[parts.length - 1] || "";
        const city = parts.length > 2 ? parts[parts.length - 3] : ""; // Third last element (to skip state)

        setCity(city);
        setCountry(country);
    };

    // Handle place selection
    const handleSelectPlace = async (placeId: any, description: any) => {
        setSearchInput(description);
        setShowSuggestions(false);

        const details = await getPlaceDetails(placeId);
        if (details) {
            const newLocation = {
                lat: details.latitude,
                lng: details.longitude,
                address: details.address
            };

            setSelectedLocation(newLocation);
            setMapCenter({ lat: details.latitude, lng: details.longitude });

            // Extract city and country
            extractCityAndCountry(details.address);
        }
    };

    // Handle submit button click
    const handleSubmit = () => {
        const locationData = {
            googleMapAddress: selectedLocation?.address || '',
            floor,
            buildingName,
            city,
            country
        };
        console.log('Location Data:', locationData);
        if (type === 'source') {
            addSourceAddress(locationData);
            setOpen(false);
        } else {
            addDestinationAddress(locationData);
            setOpen(false);
        }
    };

    // Reset form when component closes
    useEffect(() => {
        if (!isOpen) {
            // Don't reset everything to allow reopening with previous data
            setShowSuggestions(false);
        }
    }, [isOpen]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (suggestionRef.current && !(suggestionRef.current as any).contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Only check for Google Maps loaded state once
    useEffect(() => {
        if (window.google && window.google.maps) {
            googleMapsLoaded.current = true;
        }
    }, []);

    // Render Map with Conditional LoadScript
    const renderMap = () => {
        // If Google Maps is already loaded, don't use LoadScript
        if (window.google && window.google.maps) {
            return (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={13}
                >
                    {selectedLocation && (
                        <Marker
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        />
                    )}
                </GoogleMap>
            );
        }

        // If not loaded, use LoadScript (will only happen once)
        return (
            <LoadScript 
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''}
                onLoad={() => { googleMapsLoaded.current = true; }}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={13}
                >
                    {selectedLocation && (
                        <Marker
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        );
    };

    return (
        <Sheet
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            detent="full-height"
        >
            <Sheet.Container>
                <Sheet.Header>
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">Compliance Details</h2>
                    </div>
                </Sheet.Header>
                <Sheet.Content>
                    <div className="p-4 overflow-y-auto">
                        {/* Search Bar */}
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                placeholder="Search for a location"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Search Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div
                                    ref={suggestionRef}
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                                >
                                    {suggestions.map((suggestion: any) => (
                                        <div
                                            key={suggestion.place_id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelectPlace(suggestion.place_id, suggestion.description)}
                                        >
                                            {suggestion.description}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Google Map */}
                        <div className="rounded-lg overflow-hidden border border-gray-300 mb-4">
                            {renderMap()}
                        </div>

                        {/* Additional Fields - Only show when location is selected */}
                        {selectedLocation && (
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="font-medium">Selected Address:</p>
                                    <p>{selectedLocation.address}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Floor
                                        </label>
                                        <input
                                            type="text"
                                            value={floor}
                                            onChange={(e) => setFloor(e.target.value)}
                                            placeholder="Floor number"
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Building Name
                                        </label>
                                        <input
                                            type="text"
                                            value={buildingName}
                                            onChange={(e) => setBuildingName(e.target.value)}
                                            placeholder="Building name"
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="City"
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="Country"
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Save Location
                                </button>
                            </div>
                        )}
                    </div>
                </Sheet.Content>
            </Sheet.Container>
        </Sheet>
    );
};

// Add this to make TypeScript happy with the window.google property
declare global {
    interface Window {
        google: any;
    }
}

export default MapSheet;