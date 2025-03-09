"use client"

// pages/packaging-details.js
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PackagingDetails() {
    //   const router = useRouter();
    const [selectedType, setSelectedType] = useState<any>('Box');
    const [currentBox, setCurrentBox] = useState<any>(null);
    const [customDimensions, setCustomDimensions] = useState<any>({
        length: '',
        width: '',
        height: ''
    });
    const [packages, setPackages] = useState<any>([]);

    // Load packages from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPackages = localStorage.getItem('packageData');
            if (savedPackages) {
                setPackages(JSON.parse(savedPackages));
            }
        }
    }, []);

    const boxTypes = [
        {
            id: 'small',
            name: 'Small Boxes',
            description: 'For electronics, small gadgets, books, etc.',
            dimensions: { length: 30, width: 25, height: 7 },
            dimensionsText: '30 × 25 × 7 cm (12 × 10 × 0.8 inches)',
            weight: 'Up to 2 kg (4.4 lb)',
            icon: '📦'
        },
        {
            id: 'medium',
            name: 'Medium Boxes',
            description: 'For clothes, shoes, medium-sized products',
            dimensions: { length: 40, width: 30, height: 20 },
            dimensionsText: '40 × 30 × 20cm (16 × 12 × 8 inches)',
            weight: 'Up to 5 - 15 kg (11 - 33 lbs)',
            icon: '📁'
        },
        {
            id: 'large',
            name: 'Large Boxes',
            description: 'For household items, bulky products',
            dimensions: { length: 60, width: 40, height: 40 },
            dimensionsText: '60 × 40 × 40cm (24 × 16 × 16 inches)',
            weight: 'Up to 20 - 30 kg (44 - 66 lbs)',
            icon: '🗄️'
        }
    ];

    const handleSelectBox = (box: any) => {
        setCurrentBox(box);
    };

    const handleAddBox = () => {
        if (currentBox) {
            const newPackage = {
                boxType: currentBox.id,
                packgaeType: selectedType,
                dimensions: { ...currentBox.dimensions }
            };

            const updatedPackages = [...packages, newPackage];
            setPackages(updatedPackages);

            // Save to localStorage
            localStorage.setItem('packageData', JSON.stringify(updatedPackages));

            // Reset current selection
            setCurrentBox(null);
        }
    };

    const handleAddCustomBox = () => {
        console.log(selectedType)
        if (customDimensions.length && customDimensions.width && customDimensions.height) {
            const newPackage = {
                boxType: 'custom',
                packgaeType: selectedType,
                dimensions: {
                    length: parseInt(customDimensions.length),
                    width: parseInt(customDimensions.width),
                    height: parseInt(customDimensions.height)
                }
            };

            console.log('newPackage: ', newPackage)

            const updatedPackages = [...packages, newPackage];
            setPackages(updatedPackages);

            // Save to localStorage
            localStorage.setItem('packageData', JSON.stringify(updatedPackages));

            // Reset custom dimensions
            setCustomDimensions({ length: '', width: '', height: '' });
        }
    };

    const handleNext = () => {
        // Ensure we have at least one package saved
        if (packages.length > 0) {
            // Navigate to next page
            window.location.href = '/shipping-details';
        } else {
            alert('Please add at least one package before continuing');
        }
    };

    return (
        <>
            <Head>
                <title>Packaging Details</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-md mx-auto bg-white shadow-lg">
                    {/* Header */}
                    <div className="px-4 py-3 border-b flex items-center">
                        <button
                            className="text-blue-500 mr-2"
                        >
                            &lt;
                        </button>
                        <h1 className="text-lg font-medium">Packaging Details</h1>
                        <button className="ml-auto text-blue-500">
                            ↺
                        </button>
                    </div>

                    {/* Package Type Selection */}
                    <div className="bg-blue-500 p-4">
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="text-center font-medium mb-3">Pick your Package Type</p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    className={`px-3 py-1 rounded-full flex items-center ${selectedType === 'Box' ? 'bg-gray-200' : 'bg-gray-100'}`}
                                    onClick={() => setSelectedType('Box')}
                                >
                                    <span>Box</span> <span className="ml-1">📦</span>
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full flex items-center ${selectedType === 'Fragile' ? 'bg-gray-200' : 'bg-gray-100'}`}
                                    onClick={() => setSelectedType('Fragile')}
                                >
                                    <span>Fragile</span> <span className="ml-1">🥚</span>
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full flex items-center ${selectedType === 'Pallet' ? 'bg-gray-200' : 'bg-gray-100'}`}
                                    onClick={() => setSelectedType('Pallet')}
                                >
                                    <span>Pallet</span> <span className="ml-1">🧱</span>
                                </button>
                            </div>
                        </div>

                        <h2 className="text-white text-2xl font-bold">Package Dimensions</h2>
                    </div>

                    {/* Box Listing */}
                    <div className="p-4">
                        {boxTypes.map((box) => (
                            <div
                                key={box.id}
                                className={`mb-4 p-4 border rounded-lg ${currentBox?.id === box.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{box.name}</h3>
                                        <p className="text-sm text-green-600 mb-3">{box.description}</p>

                                        <div className="flex items-center mt-2">
                                            <span className="text-3xl mr-3">{box.icon}</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Dimensions: {box.dimensionsText}</p>
                                                <p className="text-sm text-gray-600">Weight: {box.weight}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`mt-1 px-3 py-1 rounded ${currentBox?.id === box.id ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => handleSelectBox(box)}
                                    >
                                        {currentBox?.id === box.id ? 'Selected' : 'Select'}
                                    </button>
                                </div>

                                {currentBox?.id === box.id && (
                                    <div className="mt-3 text-center">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                            onClick={handleAddBox}
                                        >
                                            Add Box
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Dimensions */}
                        <div className="border rounded-lg p-4 mb-4">
                            <h3 className="font-bold text-lg mb-2">Custom Dimensions</h3>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div>
                                    <label className="text-xs text-gray-600">Length (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded p-2"
                                        value={customDimensions.length}
                                        onChange={(e) => setCustomDimensions({ ...customDimensions, length: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Width (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded p-2"
                                        value={customDimensions.width}
                                        onChange={(e) => setCustomDimensions({ ...customDimensions, width: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Height (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded p-2"
                                        value={customDimensions.height}
                                        onChange={(e) => setCustomDimensions({ ...customDimensions, height: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full bg-blue-500 text-white py-2 rounded-lg"
                                onClick={handleAddCustomBox}
                                disabled={!customDimensions.length || !customDimensions.width || !customDimensions.height}
                            >
                                Add Custom Box
                            </button>
                        </div>

                        {/* Selected Packages */}
                        {packages.length > 0 && (
                            <div className="border rounded-lg p-4 mb-4">
                                <h3 className="font-bold text-lg mb-2">Selected Packages ({packages.length})</h3>
                                {packages.map((pkg: any, index: any) => (
                                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded text-sm">
                                        <strong>{pkg.boxType === 'custom' ? 'Custom' : pkg.boxType.charAt(0).toUpperCase() + pkg.boxType.slice(1)}</strong>:
                                        {pkg.dimensions.length} × {pkg.dimensions.width} × {pkg.dimensions.height} cm
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Next Button */}
                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold"
                            onClick={handleNext}
                            disabled={packages.length === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}