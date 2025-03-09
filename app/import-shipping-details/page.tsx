"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, AlertTriangle, CheckCircle, Box as BoxIcon, X, Info } from 'lucide-react';
import Link from 'next/link';
import { saveShipmentDetails } from '@/utils/api.utils';
import { useMutation } from '@tanstack/react-query';


export default function ItemDetailsPage() {
    const [boxes, setBoxes] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [complianceData, setComplianceData] = useState<any>({});

    useEffect(() => {
        // Get boxes data from localStorage
        const loadBoxes = async () => {
            try {
                const boxesData = localStorage.getItem('filledBoxes');
                if (boxesData) {
                    const parsed = JSON.parse(boxesData);
                    const boxesArray = parsed.boxes || [];
                    setBoxes(boxesArray);

                    // Process all items for compliance checking
                    await checkAllItemsCompliance(boxesArray);
                }
            } catch (error) {
                console.error("Failed to load boxes:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBoxes();
    }, []);

    // Check compliance for all items across all boxes
    const checkAllItemsCompliance = async (boxesArray: any) => {
        const uniqueItems = new Map();

        // Collect all unique items by ID
        boxesArray.forEach((box: any) => {
            if (box.items && box.items.length) {
                box.items.forEach((item: any) => {
                    if (item._id && !uniqueItems.has(item._id)) {
                        uniqueItems.set(item._id, item);
                    }
                });
            }
        });

        // Check compliance for each unique item
        const complianceResults: any = {};
        for (const [itemId, item] of uniqueItems.entries()) {
            try {
                // In a real app, you would call the API here
                // For demo, we'll use mock results
                // const result = await usCheckCompliance(item);

                // Mock result based on item name
                const mockResult = {
                    status: ["Plastic", "Paper"].includes(item.itemName) ? "allowed" : "restricted",
                    message: ["Plastic", "Paper"].includes(item.itemName)
                        ? `${item.itemName} is ALLOWED for export`
                        : `${item.itemName} is NOT ALLOWED for export to the UAE`
                };

                complianceResults[itemId] = mockResult;
            } catch (error) {
                console.error(`Error checking compliance for item ${itemId}:`, error);
                complianceResults[itemId] = {
                    status: "error",
                    message: "Error checking compliance status"
                };
            }
        }

        setComplianceData(complianceResults);
    };

    const openItemDetails = (item: any) => {
        setSelectedItem(item);
    };

    const closeDetails = () => {
        setSelectedItem(null);
    };

    const getItemComplianceStatus = (itemId: any) => {
        return complianceData[itemId] || null;
    };

    // Total item count
    const totalItems = boxes.reduce((acc: any, box: any) => acc + (box.items?.length || 0), 0);

    // Count restricted items
    const restrictedItems = Object.values(complianceData).filter(
        (result: any) => result.status === "restricted"
    ).length;

    const handleSaveShipment = () => {

    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <Link href="/dashboard" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-semibold">Items & Compliance</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">Shipment Summary</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Total Boxes</p>
                                    <p className="text-2xl font-bold">{boxes.length}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Total Items</p>
                                    <p className="text-2xl font-bold">{totalItems}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Total Weight</p>
                                    <p className="text-2xl font-bold">
                                        {boxes.reduce((acc: any, box: any) => acc + (box.totalWeight || 0), 0)} kg
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Restricted Items</p>
                                    <p className="text-2xl font-bold">{restrictedItems}</p>
                                </div>
                            </div>

                            {restrictedItems > 0 && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                                    <p className="text-red-700 text-sm">
                                        Warning: Your shipment contains {restrictedItems} restricted item(s) that may not be allowed for export.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Boxes List */}
                        <div className="space-y-4">
                            {boxes.map((box: any, boxIndex: any) => (
                                <div key={boxIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                        <div className="flex items-center">
                                            <BoxIcon className="h-5 w-5 text-gray-500 mr-2" />
                                            <h3 className="font-medium capitalize">{box.boxType} Box</h3>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {box.dimensions.length}×{box.dimensions.width}×{box.dimensions.height} cm • Max {box.maxWeight}kg
                                        </div>
                                    </div>

                                    <div className="divide-y">
                                        {box.items && box.items.length > 0 ? (
                                            box.items.map((item: any, itemIndex: any) => {
                                                const compliance = getItemComplianceStatus(item._id);
                                                return (
                                                    <div
                                                        key={itemIndex}
                                                        className={`p-4 hover:bg-gray-50 flex justify-between items-center cursor-pointer ${compliance && compliance.status === "restricted" ? "bg-red-50" : ""
                                                            }`}
                                                        onClick={() => openItemDetails(item)}
                                                    >
                                                        <div className="flex-grow">
                                                            <div className="flex items-center">
                                                                <h4 className="font-medium">{item.itemName}</h4>
                                                                {compliance && (
                                                                    <span className="ml-2">
                                                                        {compliance.status === "allowed" ? (
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        ) : compliance.status === "restricted" ? (
                                                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                                                        ) : (
                                                                            <Info className="h-4 w-4 text-gray-400" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {item.itemManufacturer} • {item.itemWeight}kg • {item.material}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm text-gray-600 flex items-center">
                                                            <span>HS: {item.hsCode}</span>
                                                            {compliance && compliance.status === "restricted" && (
                                                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                    Restricted
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">No items in this box</div>
                                        )}
                                    </div>

                                    <div className="p-3 bg-gray-50 border-t text-sm text-gray-500">
                                        Total Weight: {box.totalWeight}kg / {box.maxWeight}kg
                                    </div>
                                </div>
                            ))}

                            {boxes.length === 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                    <p className="text-gray-500">No boxes found. Please add some boxes first.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Item Details Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Item Details</h2>
                            <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name of product</p>
                                <p className="font-medium">{selectedItem.itemName}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">HS Code (Harmonized System Code)</p>
                                <p className="font-medium">{selectedItem.hsCode}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Manufacturer Name</p>
                                <p className="font-medium">{selectedItem.itemManufacturer}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Material</p>
                                <p className="font-medium">{selectedItem.material}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Weight</p>
                                <p className="font-medium">{selectedItem.itemWeight} kg</p>
                            </div>

                            {/* Compliance Result */}
                            {selectedItem._id && complianceData[selectedItem._id] ? (
                                <div className={`p-4 rounded-lg flex ${complianceData[selectedItem._id].status === "allowed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}>
                                    {complianceData[selectedItem._id].status === "allowed" ? (
                                        <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-medium">{selectedItem.itemName}</p>
                                        <p>{complianceData[selectedItem._id].message}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                                    <Info className="h-5 w-5 mr-2 text-gray-500" />
                                    <p className="text-gray-600">Compliance information unavailable</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button onClick={handleSaveShipment} className="bg-blue-500 text-white px-4 py-2 rounded-md">View Shipment Report</button>
        </div>
    );
}