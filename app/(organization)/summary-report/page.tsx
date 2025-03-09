"use client"
"use client"

import React, { useState } from 'react';
import { useShipments } from '@/hooks/useShipments';
import {
    Package,
    Truck,
    Calendar,
    MapPin,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    X,
    Download,
    FileText,
    QrCode,
    ChevronRight,
    Clock,
    Box,
    Loader2
} from 'lucide-react';
import { getReport } from '@/utils/api.utils';

export default function ShipmentDashboard() {
    const { data: shipments, isLoading, error } = useShipments();
    const [selectedShipment, setSelectedShipment] = useState<any>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'report'

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewReport = async (shipment: any) => {
        setSelectedShipment(shipment);
        setIsLoadingReport(true);

        try {
            const report = await getReport(shipment);
            console.log(report, "report")
            setReportData(report);
            setViewMode('report');
        } catch (error) {
            console.error("Failed to get report:", error);
            // Handle error state here
        } finally {
            setIsLoadingReport(false);
        }
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedShipment(null);
        setReportData(null);
    };

    const getTotalItems = (shipment: any) => {
        return shipment.boxes.reduce((total: any, box: any) => total + box.items.length, 0);
    };

    const getTotalBoxes = (shipment: any) => {
        return shipment.boxes.length;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl text-gray-700 font-medium">Loading shipments...</h2>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl text-gray-700 font-medium">Failed to load shipments</h2>
                <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
        );
    }

    // Render shipment compliance report
    if (viewMode === 'report' && reportData) {
        return (
            <div className="bg-gray-50 min-h-screen p-4 md:p-6">
                <button
                    onClick={handleBackToList}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowRight size={16} className="rotate-180 mr-2" />
                    Back to shipments
                </button>

                <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Shipment Compliance Report</h1>
                            {reportData?.status ? (
                                <div className="bg-green-500 rounded-full p-2">
                                    <CheckCircle size={24} />
                                </div>
                            ) : (
                                <div className="bg-red-500 rounded-full p-2">
                                    <AlertTriangle size={24} />
                                </div>
                            )}
                        </div>
                        <p className="text-blue-100 mt-2">Generated on {formatDate(reportData.summary.generatedAt)}</p>
                    </div>

                    {/* Status Banner */}
                    {reportData.status ? (
                        <div className="bg-green-500 text-white p-4 text-center font-bold">
                            <span className="flex items-center justify-center gap-2">
                                <CheckCircle size={20} />
                                Your shipment complies with export regulations
                            </span>
                        </div>
                    ) : (
                        <div className="bg-red-500 text-white p-4 text-center font-bold">
                            <span className="flex items-center justify-center gap-2">
                                <X size={20} className="font-bold" />
                                Your shipment does not comply with export regulations
                            </span>
                        </div>
                    )}

                    {/* Shipment Summary */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Shipment Details</h2>
                            <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm">
                                ID: {reportData.summary.shipmentId.substring(0, 8)}...
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Origin */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700 mb-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    <h3 className="font-medium">Origin</h3>
                                </div>
                                <p className="font-semibold text-gray-800">{reportData.summary.organizationName}</p>
                                <p className="text-gray-600 mt-1">
                                    {reportData.summary.sourceAdress.buildingName}, Floor {reportData.summary.sourceAdress.floor}
                                </p>
                                <p className="text-gray-600">
                                    {reportData.summary.sourceAdress.googleMapAddress}
                                </p>
                            </div>

                            {/* Destination */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700 mb-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    <h3 className="font-medium">Destination</h3>
                                </div>
                                <p className="font-semibold text-gray-800">{reportData.summary.destinationAdress.city}, {reportData.summary.destinationAdress.country}</p>
                                <p className="text-gray-600">
                                    {reportData.summary.destinationAdress.googleMapAddress}
                                </p>
                            </div>
                        </div>

                        {/* Shipment Date */}
                        <div className="flex items-center gap-2 text-gray-700 mb-4">
                            <Clock size={18} className="text-blue-500" />
                            <span className="font-medium">Shipment Date:</span>
                            <span>{formatDate(reportData.summary.shipmentDate)}</span>
                        </div>

                        {/* Items Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-gray-800 mb-3">Items Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{reportData.summary.totalItems}</div>
                                    <div className="text-sm text-gray-600">Total Items</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-500">{reportData.summary.approvedItems}</div>
                                    <div className="text-sm text-gray-600">Approved</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-500">{reportData.summary.rejectedItems}</div>
                                    <div className="text-sm text-gray-600">Rejected</div>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <h3 className="font-medium text-gray-800 mb-3">Items</h3>
                        <div className="space-y-4 mb-6">
                            {reportData.report.map((item: any, index: any) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{item.itemName}</h4>
                                            <p className="text-sm text-gray-600">Manufacturer: {item.itemManufacturer}</p>
                                        </div>
                                        {item.status ? (
                                            <div className="bg-green-100 text-green-600 p-1 rounded">
                                                <CheckCircle size={16} />
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 text-red-600 p-1 rounded">
                                                <X size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                        <div>
                                            <span className="text-gray-500">Material:</span> {item.material}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Weight:</span> {item.itemWeight} kg
                                        </div>
                                        <div>
                                            <span className="text-gray-500">HS Code:</span> {item.hsCode}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Export Status:</span>
                                            {item.exportStatus ? (
                                                <span className="text-green-500 ml-1">Approved</span>
                                            ) : (
                                                <span className="text-red-500 ml-1">Rejected</span>
                                            )}
                                        </div>
                                    </div>
                                    {!item.exportStatus && (
                                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                                            {item.exportReason}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center mb-6">
                            <div className="text-center">
                                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                                    <img
                                        src={reportData.qrCode}
                                        alt="QR Code for shipment details"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Scan to view full details</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                                <Download size={18} />
                                <span>Download Report</span>
                            </button>
                            <a
                                href={reportData.printUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                <FileText size={18} />
                                <span>Print Details</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render shipments list
    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shipments</h1>
                    <p className="text-gray-600 mt-2">Manage and track your shipments</p>
                </header>

                {shipments && shipments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {shipments.map((shipment: any) => (
                            <div key={shipment._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">{shipment.organizationName}</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                ID: {shipment._id.substring(0, 8)}...
                                            </p>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                <Calendar size={14} className="mr-1" />
                                                {formatDate(shipment.shipmentDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        {/* Source Address */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <MapPin size={16} className="text-blue-500 mr-2" />
                                                <h3 className="font-medium">Origin</h3>
                                            </div>
                                            <p className="text-gray-700">{shipment.sourceAddress.city}, {shipment.sourceAddress.country}</p>
                                            <p className="text-sm text-gray-500 mt-1 truncate">
                                                {shipment.sourceAddress.googleMapAddress}
                                            </p>
                                        </div>

                                        {/* Destination Address */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <Truck size={16} className="text-blue-500 mr-2" />
                                                <h3 className="font-medium">Destination</h3>
                                            </div>
                                            <p className="text-gray-700">{shipment.destinationAddress.city}, {shipment.destinationAddress.country}</p>
                                            <p className="text-sm text-gray-500 mt-1 truncate">
                                                {shipment.destinationAddress.googleMapAddress}
                                            </p>
                                        </div>

                                        {/* Shipment Stats */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <Package size={16} className="text-blue-500 mr-2" />
                                                <h3 className="font-medium">Package Details</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Boxes</p>
                                                    <p className="text-gray-700 font-medium">{getTotalBoxes(shipment)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Items</p>
                                                    <p className="text-gray-700 font-medium">{getTotalItems(shipment)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Box Summary */}
                                    <div className="mb-6">
                                        <h3 className="font-medium text-gray-800 mb-3">Boxes</h3>
                                        <div className="space-y-3">
                                            {shipment.boxes.map((box: any, index: any   ) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <Box size={16} className="text-blue-500 mr-2" />
                                                            <span className="font-medium text-gray-800">
                                                                {box.boxType.charAt(0).toUpperCase() + box.boxType.slice(1)} Box
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {box.items.length} items
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 grid grid-cols-2 text-sm">
                                                        <div className="text-gray-600">
                                                            Max weight: {box.maxWeight} kg
                                                        </div>
                                                        <div className="text-gray-600">
                                                            Dimensions: {box.dimensions.length}×{box.dimensions.width}×{box.dimensions.height} cm
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewReport(shipment)}
                                        disabled={isLoadingReport}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-blue-400"
                                    >
                                        {isLoadingReport && selectedShipment?._id === shipment._id ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin mr-2" />
                                                <span>Loading Report...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FileText size={18} className="mr-2" />
                                                <span>Check Compliance Report</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No shipments found</h3>
                        <p className="text-gray-500">You don't have any shipments yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
