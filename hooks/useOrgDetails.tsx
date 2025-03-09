"use client"

import { useQuery } from "@tanstack/react-query";
import { getOrgDetails } from "@/utils/api.utils";

export const useOrgDetails = () => {
    return useQuery({
        queryKey: ["orgDetails"],
        queryFn: getOrgDetails,
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });
};
