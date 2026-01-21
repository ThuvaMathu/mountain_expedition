"use client";

import { usePathname } from "next/navigation";
import { AIChatWidget } from "./AIChatWidget";

export function AIChatWrapper() {
    const pathname = usePathname();

    // Define allowed paths (including subpaths)
    const allowedPaths = [
        "/about",
        "/contact",
        "/trekking",
        "/tours",
        "/enquire" // Added enquire as well as it's relevant
    ];

    // Exact match for home page
    const isHome = pathname === "/";

    // Check if current path starts with any allowed path
    const isAllowed = isHome || allowedPaths.some((path) => pathname?.startsWith(path));

    // Explicitly exclude admin/dashboard just in case (though list above whitelist approach handles it)
    // const isExcluded = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    if (!isAllowed) {
        return null;
    }

    return <AIChatWidget />;
}
