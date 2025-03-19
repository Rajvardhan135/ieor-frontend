import React, { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { MapPin, Globe, Building, Layers, MapIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { addSourceAddress, addDestinationAddress } from '@/utils/api.utils';

export default function AddressForm({ isOpen, setIsOpen, type }: any) {
    const [formData, setFormData] = useState({
        country: "",
        city: "",
        floor: "",
        buildingName: "",
        googleMapAddress: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (type === "source") {
            addSourceAddressMutation();
        } else {
            addDestinationAddressMutation();
        }
    };

    const { mutate: addSourceAddressMutation } = useMutation({
        mutationFn: () => addSourceAddress(formData),
        onSuccess: () => {
            console.log('Address added successfully');
            setIsOpen(false);
            setFormData({
                country: "",
                city: "",
                floor: "",
                buildingName: "",
                googleMapAddress: ""
            });
        },
    });


    const { mutate: addDestinationAddressMutation } = useMutation({
        mutationFn: () => addDestinationAddress(formData),
        onSuccess: () => {
            console.log('Address added successfully');
            setIsOpen(false);
            setFormData({
                country: "",
                city: "",
                floor: "",
                buildingName: "",
                googleMapAddress: ""
            });
        },
    });


    return (
        <div className="max-w-2xl mx-auto p-6">

            {/* Address Details Sheet */}
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <Sheet.Container>
                    <Sheet.Content>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-blue-600 p-6">
                                <h2 className="text-2xl font-bold text-white">New Address</h2>
                                <p className="text-blue-100 mt-1">Please enter your address details</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Country Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                            <Globe className="w-4 h-4 text-blue-500" />
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter country"
                                            required
                                        />
                                    </div>

                                    {/* City Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter city"
                                            required
                                        />
                                    </div>

                                    {/* Floor Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                            <Layers className="w-4 h-4 text-blue-500" />
                                            Floor
                                        </label>
                                        <input
                                            type="text"
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter floor (e.g., 5th Floor)"
                                        />
                                    </div>

                                    {/* Building Name Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                            <Building className="w-4 h-4 text-blue-500" />
                                            Building Name
                                        </label>
                                        <input
                                            type="text"
                                            name="buildingName"
                                            value={formData?.buildingName}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter building name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Google Map Address Field - Full Width */}
                                <div className="space-y-2 col-span-full">
                                    <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                                        <MapIcon className="w-4 h-4 text-blue-500" />
                                        Full Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="googleMapAddress"
                                            value={formData.googleMapAddress}
                                            onChange={handleChange}
                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter address"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                                            onClick={() => setIsOpen(true)}
                                        >
                                            <MapPin className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        type="button"
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                {/* <Sheet.Backdrop onTap={() => setIsOpen(false)} /> */}
            </Sheet>
        </div>
    );
}