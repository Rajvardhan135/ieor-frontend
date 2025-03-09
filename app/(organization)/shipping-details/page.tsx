"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import BoxFilling from '@/components/BoxFetching';
import { useMutation } from '@tanstack/react-query';
import { addItem, indiaCheckCompliance, getHsCode } from '@/utils/api.utils';
import { useOrgDetails } from '@/hooks/useOrgDetails';

export default function PackagingPage() {
    const [isClient, setIsClient] = useState(false);
    const { data: orgDetails, refetch: refetchOrgDetails } = useOrgDetails();
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [itemInfo, setItemInfo] = useState<any>({
        itemName: '',
        itemManufacturer: '',
        material: '',
        itemWeight: '',
        hsCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    // This ensures we only render the component on the client side
    // to avoid localStorage errors during server-side rendering
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Get HS Code mutation
    console.log(itemInfo)
    const getHsCodeMutation = useMutation({
        mutationFn: () => getHsCode(itemInfo.itemName),
        onSuccess: (data) => {
            setItemInfo((prev: any) => ({ ...prev, hsCode: data.hsCode }));
            // Proceed to compliance check
            checkComplianceMutation.mutate({
                itemName: itemInfo.itemName,
                itemManufacturer: itemInfo.itemManufacturer || "Not specified",
                hsCode: data.hsCode,
                itemWeight: itemInfo.itemWeight || "Not specified",
                material: itemInfo.material || "Not specified"
            });
        },
        onError: (err) => {
            setLoading(false);
            setError("Failed to get HS Code: " + err.message);
        }
    });

    // Check compliance mutation
    const checkComplianceMutation = useMutation({
        mutationFn: indiaCheckCompliance,
        onSuccess: () => {
            // If compliance check passes, add the item
            addItemMutation.mutate({
                itemName: itemInfo.itemName,
                itemManufacturer: itemInfo.itemManufacturer || "Not specified",
                hsCode: itemInfo.hsCode,
                itemWeight: itemInfo.itemWeight || "Not specified",
                material: itemInfo.material || "Not specified"
            });
        },
        onError: (err) => {
            setLoading(false);
            setError("Compliance check failed: " + err.message);
        }
    });

    // Add item mutation
    const addItemMutation = useMutation({
        mutationFn: addItem,
        onSuccess: () => {
            setLoading(false);
            setSuccess(true);
            // Refetch org details to update the items list
            refetchOrgDetails();

            // Reset form after 2 seconds
            setTimeout(() => {
                setShowAddItemForm(false);
                setItemInfo({
                    itemName: '',
                    itemManufacturer: '',
                    material: '',
                    itemWeight: '',
                    hsCode: ''
                });
                setSuccess(false);
            }, 2000);
        },
        onError: (err) => {
            setLoading(false);
            setError("Failed to add item: " + err.message);
        }
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setItemInfo((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Start the chain by getting the HS code
        getHsCodeMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <Head>
                <title>Package Management | Your App</title>
                <meta name="description" content="Manage your packages and shipments" />
            </Head>

            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Package Management</h1>

                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setShowAddItemForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add Item
                    </button>
                </div>

                {isClient && <BoxFilling />}

                {/* Add Item Modal */}
                {showAddItemForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Item</h2>

                            {success ? (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    Item added successfully!
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
                                            Item Name *
                                        </label>
                                        <input
                                            id="itemName"
                                            name="itemName"
                                            type="text"
                                            value={itemInfo.itemName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemManufacturer">
                                            Manufacturer
                                        </label>
                                        <input
                                            id="itemManufacturer"
                                            name="itemManufacturer"
                                            type="text"
                                            value={itemInfo.itemManufacturer}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="material">
                                            Material
                                        </label>
                                        <input
                                            id="material"
                                            name="material"
                                            type="text"
                                            value={itemInfo.material}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemWeight">
                                            Weight
                                        </label>
                                        <input
                                            id="itemWeight"
                                            name="itemWeight"
                                            type="text"
                                            value={itemInfo.itemWeight}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddItemForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : 'Add Item'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}