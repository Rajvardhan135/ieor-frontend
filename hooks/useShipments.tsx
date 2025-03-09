"use client"

import { useQuery } from "@tanstack/react-query";
import { getShipments } from "@/utils/api.utils";

export const useShipments = () => {
    return useQuery({
        queryKey: ["shipments"],
        queryFn: getShipments,
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });
};
