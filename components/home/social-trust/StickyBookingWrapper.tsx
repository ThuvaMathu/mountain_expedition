"use client";

import { usePathname } from "next/navigation";
import { StickyBookingCTA } from "./StickyBookingCTA";

interface StickyBookingWrapperProps {
    whatsappNumber?: string;
    phoneNumber?: string;
    offerText?: string;
}

export function StickyBookingWrapper({
    whatsappNumber,
    phoneNumber,
    offerText,
}: StickyBookingWrapperProps) {
    const pathname = usePathname();

    // Define allowed paths (including subpaths)
    const allowedPaths = [
        "/about",
        "/contact",
        "/trekking",
        "/tours",
        "/enquire"
    ];

    // Exact match for home page
    const isHome = pathname === "/";

    // Check if current path starts with any allowed path
    const isAllowed = isHome || allowedPaths.some((path) => pathname?.startsWith(path));

    if (!isAllowed) {
        return null;
    }

    return (
        <StickyBookingCTA
            whatsappNumber={whatsappNumber}
            phoneNumber={phoneNumber}
            offerText={offerText}
        />
    );
}
