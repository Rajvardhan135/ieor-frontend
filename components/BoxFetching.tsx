"use client"
// components/BoxFilling.jsx
import { useState, useEffect } from 'react';
import { useOrgDetails } from '../hooks/useOrgDetails';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { shipmentBox } from '@/utils/api.utils';

const BoxFilling = () => {
    const router = useRouter();
    const { data: orgDetails } = useOrgDetails();
    const [packages, setPackages] = useState<any>([]);
    const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState<any>({});
    const [expandedSection, setExpandedSection] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Box capacity based on size (in kg)
    const boxCapacities = {
        small: 2,
        medium: 5,
        large: 10
    };

    useEffect(() => {
        // Load package data from localStorage
        const storedPackages = localStorage.getItem('packageData');
        if (storedPackages) {
            setPackages(JSON.parse(storedPackages));
        }

        // Initialize selected items for each box
        if (packages.length > 0) {
            const initialSelectedItems: any = {};
            packages.forEach((_: any, index: any) => {
                initialSelectedItems[index] = [];
            });
            setSelectedItems(initialSelectedItems);
        }
    }, []);

    const currentBox = packages[currentBoxIndex];

    const calculateCurrentWeight = () => {
        if (!selectedItems[currentBoxIndex]) return 0;

        return selectedItems[currentBoxIndex].reduce((total: any, item: any) => {
            return total + (item.itemWeight * item.quantity);
        }, 0);
    };

    const getBoxCapacity = (boxType: any) => {
        return boxCapacities[boxType as keyof typeof boxCapacities] || 5; // Default to 5kg if unknown type
    };

    const addItemToBox = (item: any) => {
        const currentWeight = calculateCurrentWeight();
        const boxCapacity = getBoxCapacity(currentBox.boxType);
        if (currentWeight + item.itemWeight > boxCapacity) {
            alert("This would exceed the box capacity!");
            return;
        }

        setSelectedItems((prev: any) => {
            const boxItems = prev[currentBoxIndex] || [];
            const existingItemIndex = boxItems.findIndex((i: any) => i.itemName === item.itemName);

            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                const updatedItems = [...boxItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return { ...prev, [currentBoxIndex]: updatedItems };
            } else {
                // Add new item
                return {
                    ...prev,
                    [currentBoxIndex]: [...boxItems, { ...item, quantity: 1 }]
                };
            }
        });
    };

    const removeItemFromBox = (itemName: any) => {
        setSelectedItems((prev: any) => {
            const boxItems = prev[currentBoxIndex] || [];
            const updatedItems = boxItems.filter((item: any) => item.itemName !== itemName);
            return { ...prev, [currentBoxIndex]: updatedItems };
        });
    };

    const decreaseItemQuantity = (itemName: any) => {
        setSelectedItems((prev: any) => {
            const boxItems = prev[currentBoxIndex] || [];
            const existingItemIndex = boxItems.findIndex((i: any) => i.itemName === itemName);

            if (existingItemIndex >= 0) {
                const item = boxItems[existingItemIndex];
                if (item.quantity === 1) {
                    // Remove item if quantity will be 0
                    const updatedItems = boxItems.filter((item: any) => item.itemName !== itemName);
                    return { ...prev, [currentBoxIndex]: updatedItems };
                } else {
                    // Decrease quantity
                    const updatedItems = [...boxItems];
                    updatedItems[existingItemIndex] = {
                        ...item,
                        quantity: item.quantity - 1
                    };
                    return { ...prev, [currentBoxIndex]: updatedItems };
                }
            }
            return prev;
        });
    };

    const navigateToBox = (index: any) => {
        if (index >= 0 && index < packages.length) {
            setCurrentBoxIndex(index);
        }
    };

    const toggleExpandedSection = () => {
        setExpandedSection(!expandedSection);
    };

    const formatBoxesData = () => {
        return packages.map((box: any, index: any) => {
            const boxItems = selectedItems[index] || [];
            const expandedItems = boxItems.flatMap((item: any) => {
                // For each item with a quantity > 1, create multiple entries
                const entries: any = []
                for (let i = 0; i < item.quantity; i++) {
                    // Exclude the quantity field in the final data
                    const { quantity, ...itemWithoutQuantity } = item;
                    entries.push(itemWithoutQuantity);
                }
                return entries;
            });

            const totalWeight = boxItems.reduce((total: any, item: any) => {
                return total + (item.itemWeight * item.quantity);
            }, 0);

            return {
                boxType: box.boxType,
                dimensions: box.dimensions,
                maxWeight: getBoxCapacity(box.boxType),
                items: expandedItems,
                totalWeight: totalWeight
            };
        });
    };

    function transformData(boxes: any): any {
        const shipmentId = localStorage.getItem('shipmentId');
        return {
            shipmentId: shipmentId,
            items: boxes.map((box: any) => ({
                boxType: box.boxType,
                packagetype: "pallet", // Using fixed "pallet" value as in your example
                dimensions: box.dimensions,
                maxWeight: box.maxWeight,
                items: box.items.map((item: any) => {
                    // Make sure each item has all the required properties
                    return {
                        itemName: item.itemName,
                        itemManufacturer: item.itemManufacturer || "",
                        hsCode: item.hsCode || "",
                        itemWeight: item.itemWeight,
                        material: item.material || ""
                    };
                })
            })),
        };
    }

    const { mutate: createShipment, isPending } = useMutation({
        mutationFn: (data: any) => shipmentBox(data),
        onSuccess: () => {
            // router.push('/compliance-summary');
            // localStorage.removeItem('shipmentId');
            console.log("success")
        },
        onError: (error) => {
            console.error("Error creating shipment:", error);
            alert("There was an error creating your shipment. Please try again.");
        }
    });



    const saveAndContinue = () => {
        setIsSubmitting(true);
        try {
            // Format the data as required
            const boxesData = formatBoxesData();
            console.log(boxesData)
            const transformedData = transformData(boxesData);
            console.log(transformedData)
            console.log(transformedData)
            createShipment(transformedData);

            localStorage.setItem('filledBoxes', JSON.stringify({ boxes: boxesData }));

            // Navigate to the next page
            router.push('/summary-report');
        } catch (error) {
            console.error("Error saving box data:", error);
            alert("There was an error saving your data. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastBox = currentBoxIndex === packages.length - 1;

    if (!currentBox) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 m-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div className="text-lg font-medium mb-2">No packages found</div>
                <p className="text-gray-600 mb-4">Please add packages first before filling them with items.</p>
                <button
                    onClick={() => router.push('/packaging-details')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Packages
                </button>
            </div>
        );
    }

    const currentWeight = calculateCurrentWeight();
    const boxCapacity = getBoxCapacity(currentBox.boxType);
    const isBoxValid = currentWeight > 0 && currentWeight <= boxCapacity;

    // Check if warehouseItems exists, if not, use an empty array
    const warehouseItems = orgDetails?.data?.warehouseItems || [];

    // Progress percentage for the weight fill
    const fillPercentage = Math.min((currentWeight / boxCapacity) * 100, 100);

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden m-4">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <button
                    onClick={() => navigateToBox(currentBoxIndex - 1)}
                    disabled={currentBoxIndex === 0}
                    className={`text-white ${currentBoxIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    ← Back
                </button>
                <h1 className="text-xl font-bold">Fill Boxes</h1>
                <div></div>
            </div>

            {/* Box Details */}
            <div className="bg-blue-50 p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Box {currentBoxIndex + 1} of {packages.length}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {currentBox.boxType.charAt(0).toUpperCase() + currentBox.boxType.slice(1)}
                    </span>
                </div>
                <div className="border-b border-blue-300 my-2"></div>
                <div className="flex items-center justify-between">
                    <div className="bg-orange-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l4-2 4 2 4-2 4 2V4a2 2 0 00-2-2H5zm0 2h10v10.38l-2-1-4 2-4-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1 ml-3">
                        <p className="text-sm text-gray-600">
                            Dimensions: {currentBox.dimensions.length} × {currentBox.dimensions.width} × {currentBox.dimensions.height} cm
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            Weight Capacity: Up to {boxCapacity} kg
                        </p>

                        {/* Progress bar for weight */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${fillPercentage > 90 ? 'bg-red-500' : fillPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${fillPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Current Weight: <span className="font-medium">{currentWeight.toFixed(1)}</span> / {boxCapacity} kg
                        </p>
                    </div>
                </div>
            </div>

            {/* Selected Items */}
            <div className="p-4">
                <h3 className="font-medium mb-2">Items in this box:</h3>
                <div className="mb-4">
                    {selectedItems[currentBoxIndex] && selectedItems[currentBoxIndex].length > 0 ? (
                        <ul className="space-y-2">
                            {selectedItems[currentBoxIndex].map((item: any, index: any) => (
                                <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                                    <div>
                                        <span className="font-medium">{item.itemName}</span>
                                        <p className="text-xs text-gray-500">{item.material} • {item.itemWeight}kg each</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => decreaseItemQuantity(item.itemName)}
                                            className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="w-5 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => addItemToBox(item)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500 text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p>No items added yet</p>
                            <p className="text-xs mt-1">Add items from the list below</p>
                        </div>
                    )}
                </div>

                {/* Clickable Item List */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Add from your items:</h3>
                        <button
                            onClick={toggleExpandedSection}
                            className="text-blue-600 text-sm flex items-center"
                        >
                            {expandedSection ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Hide
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Show
                                </>
                            )}
                        </button>
                    </div>

                    {expandedSection && (
                        <div className="bg-gray-50 rounded border border-gray-200">
                            {warehouseItems.length > 0 ? (
                                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                                    {warehouseItems.map((item: any, index: any) => (
                                        <li key={index} className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
                                            <div className="flex items-center">
                                                <div className="bg-orange-50 p-1 mr-3 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.itemName}</p>
                                                    <p className="text-xs text-gray-500">{item.material} • {item.itemWeight}kg</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => addItemToBox(item)}
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                                            >
                                                Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>No items available</p>
                                    <p className="text-xs mt-1">Add items to your warehouse first</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Box Navigation */}
            <div className="px-4 pb-4 flex justify-between">
                <button
                    onClick={() => navigateToBox(currentBoxIndex - 1)}
                    disabled={currentBoxIndex === 0}
                    className={`px-4 py-2 rounded transition-colors ${currentBoxIndex === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                >
                    Previous Box
                </button>

                {isLastBox ? (
                    <button
                        onClick={saveAndContinue}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                Complete
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => navigateToBox(currentBoxIndex + 1)}
                        disabled={currentBoxIndex === packages.length - 1}
                        className={`px-4 py-2 rounded transition-colors ${currentBoxIndex === packages.length - 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                    >
                        Next Box
                    </button>
                )}
            </div>

            {/* Status Banner */}
            {isBoxValid && (
                <div className="bg-green-500 text-white p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>All good! Your shipment is compliant with regulations</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoxFilling;