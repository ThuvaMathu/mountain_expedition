"use client";

import { usePathname } from "next/navigation";
import { FloatingSocialMedia } from "./floating-social-media";

interface FloatingSocialMediaWrapperProps {
    contactDetails: any; // Using any to avoid type import issues, matching usage in layout
}

export function FloatingSocialMediaWrapper({ contactDetails }: FloatingSocialMediaWrapperProps) {
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

    return <FloatingSocialMedia contactDetails={contactDetails} />;
}
