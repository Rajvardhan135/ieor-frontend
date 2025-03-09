"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ShippingDashboard() {
    const menuItems = [
        {
            id: 'ship-parcel',
            title: 'Ship parcel',
            icon: '/icons/truck.svg',
            href: '/check-compliance'
        },
        {
            id: 'check-label',
            title: 'Check Label',
            icon: '/icons/check-label.svg',
            href: '/check-label'
        },
        {
            id: 'dash-board',
            title: 'Dash Board',
            icon: '/icons/dashboard.svg',
            href: '/dashboard'
        },
        {
            id: 'qr',
            title: 'QR',
            icon: '/icons/qr.svg',
            href: '/qr'
        },
        {
            id: 'saved-shipments',
            title: 'Saved shipments',
            icon: '/icons/saved.svg',
            href: '/saved-shipments'
        },
        {
            id: 'help-center',
            title: 'Help Center',
            icon: '/icons/help.svg',
            href: '/help-center'
        },
        {
            id: 'regulatory-updates',
            title: 'Regulatory Updates',
            icon: '/icons/regulatory.svg',
            href: '/regulatory-updates'
        },
        {
            id: 'documentation-assistance',
            title: 'Documentation Assistance',
            icon: '/icons/documentation.svg',
            href: '/documentation-assistance'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shipping Dashboard</h1>

                {/* Grid Layout for Menu Items */}
                <div className="grid grid-cols-4 gap-4">
                    {menuItems.map((item) => (
                        <Link key={item.id} href={item.href} className="block">
                            <div
                                className="flex flex-col items-center p-3 bg-white rounded-xl shadow hover:shadow-md hover:bg-blue-50 transition-all duration-200 h-full border border-gray-100"
                            >
                                <div className="w-12 h-12 flex items-center justify-center mb-2 bg-blue-50 rounded-full p-2">
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <p className="text-center text-xs font-medium text-gray-700">{item.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>

               

                {/* Assured Compliance Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 flex items-center shadow-sm text-white">
                    <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white bg-opacity-20 rounded-full p-2 flex items-center justify-center">
                        <Image
                            src="/icons/progress.svg"
                            alt="Compliance"
                            width={32}
                            height={32}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Assured Compliance</h3>
                        <p className="text-sm opacity-90">Your shipments meet all regulatory requirements</p>
                    </div>
                </div>

            </div>
        </div>
    );
}