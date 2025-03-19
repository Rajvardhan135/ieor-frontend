"use client"

import React, { useEffect, useState } from "react";
import { useOrgDetails } from "@/hooks/useOrgDetails";
import { Sheet } from "react-modal-sheet";
import { useMutation } from "@tanstack/react-query";
import { addSourceAddress, addDestinationAddress, shipmentCreate } from "@/utils/api.utils";
import MapSheet from "@/components/maps";

export default function CheckCompliancePage() {
    const { data, error, isLoading } = useOrgDetails();
    const [isOpen, setOpen] = useState(false);
    const [sourceAddress, setSourceAddress] = useState<any>({});
    const [destinationAddress, setDestinationAddress] = useState({});
    const [selectSource, setSelectSource] = useState<any>(false);
    const [selectDestination, setSelectDestination] = useState<any>(false);
    const [type, setType] = useState<any>("source");
    const [shipmentDate, setShipmentDate] = useState<string>("");

    // Define all mutations outside of conditional blocks
    const { mutate: addSourceAddressMutation } = useMutation({
        mutationFn: () => addSourceAddress(sourceAddress),
        onSuccess: () => {
            console.log("Source address added successfully");
        },
    });

    const { mutate: addDestinationAddressMutation } = useMutation({
        mutationFn: () => addDestinationAddress(destinationAddress),
        onSuccess: () => {
            console.log("Destination address added successfully");
        },
    });

    const { mutate: shipmentCreateMutation } = useMutation({
        mutationFn: () => shipmentCreate(
            {
                sourceAddress: selectSource,
                destinationAddress: selectDestination,
            }
        ),
        onSuccess: (data: any) => {
            console.log("Shipment created successfully");
            localStorage.setItem('shipmentId', data.shipmentId);
        },
    });

    const onNext = async () => {
        if (selectSource && selectDestination && shipmentDate) {
            // Format the date in ISO format
            const formattedDate = new Date(shipmentDate).toISOString();

            localStorage.setItem('sourceAddress', JSON.stringify(selectSource));
            localStorage.setItem('destinationAddress', JSON.stringify(selectDestination));
            localStorage.setItem('shipmentDate', formattedDate);
            shipmentCreateMutation();

            window.location.href = '/packaging-details';
        }
    }

    const onAddSourceAddress = async () => {
        setType("source");
        setOpen(true);
    }

    const onAddDestinationAddress = async () => {
        setType("destination");
        setOpen(true);
    }

    // Render loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <p className="text-red-500 text-center font-medium">Error loading organization details</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Check Compliance</h1>

                {/* Journey Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {/* FROM section */}
                    <div className="border-b border-gray-200 p-5">
                        <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600 fill-current">
                                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm font-medium mb-1">FROM</p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">{selectSource?.city || 'Select source'}</h2>
                                    <span className="text-gray-400 text-sm bg-gray-100 px-2 py-1 rounded">
                                        {selectSource?.country?.substring(0, 3).toUpperCase() || '---'}
                                    </span>
                                </div>
                                {selectSource?.googleMapAddress && (
                                    <p className="text-gray-500 text-sm mt-1 truncate">{selectSource.googleMapAddress}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dimension indicator */}
                    <div className="relative h-0">
                        <div className="absolute right-8 -bottom-3 bg-blue-500 text-white text-xs font-medium rounded-full px-3 py-1 shadow-sm">
                            404.55 × 66.33
                        </div>
                    </div>

                    {/* TO section */}
                    <div className="p-5 bg-gray-50">
                        <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600 fill-current">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 4.5-8-4.5V6h16zm0 12H4V9.62l8 4.5 8-4.5V18z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm font-medium mb-1">TO</p>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">{selectDestination?.city || 'Select destination'}</h2>
                                    <span className="text-gray-400 text-sm bg-gray-100 px-2 py-1 rounded">
                                        {selectDestination?.country?.substring(0, 3).toUpperCase() || '---'}
                                    </span>
                                </div>
                                {selectDestination?.googleMapAddress && (
                                    <p className="text-gray-500 text-sm mt-1 truncate">{selectDestination.googleMapAddress}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom action bar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
                    {/* Shipment date - currently empty */}
                    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center flex-1">
                        <div className="w-8 h-8 flex-shrink-0 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-current">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7z" />
                            </svg>
                        </div>
                        <div className="w-full">
                            <p className="text-gray-500 text-xs font-medium">SHIPMENT DATE</p>
                            <input
                                type="datetime-local"
                                className="font-medium text-gray-800 w-full outline-none"
                                value={shipmentDate}
                                onChange={(e) => setShipmentDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={onNext}
                        disabled={!selectSource || !selectDestination || !shipmentDate}
                        className={`
        ${(!selectSource || !selectDestination || !shipmentDate) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
        text-white rounded-lg px-6 py-3 font-bold flex items-center justify-center transition-colors duration-200 w-full sm:w-1/3
    `}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                </div>

                {/* Source Addresses Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Source Addresses</h3>
                        <button
                            onClick={onAddSourceAddress}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Source
                        </button>
                    </div>
                    <div className="space-y-2">
                        {data?.data.sourceAddresses?.length > 0 ? (
                            data?.data.sourceAddresses?.map((address: any, index: any) => (
                                <div
                                    onClick={() => setSelectSource(address)}
                                    key={index}
                                    className={`p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${selectSource === address ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="font-medium text-gray-800">{address.googleMapAddress}</div>
                                    {address.city && address.country && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {address.city}, {address.country}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                No source addresses available. Add a new source address to continue.
                            </div>
                        )}
                    </div>
                </div>

                {/* Destination Addresses Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Destination Addresses</h3>
                        <button
                            onClick={onAddDestinationAddress}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Destination
                        </button>
                    </div>
                    <div className="space-y-2">
                        {data?.data.destinationAddresses?.length > 0 ? (
                            data?.data.destinationAddresses?.map((address: any, index: any) => (
                                <div
                                    onClick={() => setSelectDestination(address)}
                                    key={index}
                                    className={`p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${selectDestination === address ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="font-medium text-gray-800">{address.googleMapAddress}</div>
                                    {address.city && address.country && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {address.city}, {address.country}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                No destination addresses available. Add a new destination address to continue.
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Sheet component */}
                <MapSheet isOpen={isOpen} setOpen={setOpen} type={type} data={data} />
            </div>
        </div>
    );
}