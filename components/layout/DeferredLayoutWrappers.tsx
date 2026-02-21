"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import heavy components
const AIChatWrapper = dynamic(() => import("@/components/ai-bot/AIChatWrapper").then(mod => ({ default: mod.AIChatWrapper })), {
    ssr: false
});

const FloatingSocialMediaWrapper = dynamic(() => import("../ui/FloatingSocialMediaWrapper").then(mod => ({ default: mod.FloatingSocialMediaWrapper })), {
    ssr: false
});

const StickyBookingWrapper = dynamic(() => import("../home/social-trust/StickyBookingWrapper").then(mod => ({ default: mod.StickyBookingWrapper })), {
    ssr: false
});

interface DeferredLayoutWrappersProps {
    contactDetails: any;
}

export function DeferredLayoutWrappers({ contactDetails }: DeferredLayoutWrappersProps) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Defer loading until page is interactive
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 1000); // Load after 1 second

        return () => clearTimeout(timer);
    }, []);

    if (!shouldLoad) return null;

    return (
        <>
            <FloatingSocialMediaWrapper contactDetails={contactDetails} />
            <StickyBookingWrapper
                whatsappNumber={contactDetails?.socialMedia?.whatsapp?.replace(/\D/g, "")}
                phoneNumber={contactDetails?.phone}
            //offerText="Limited: 15% Off Season Bookings"
            />
            {/* <AIChatWrapper /> */}
        </>
    );
}
