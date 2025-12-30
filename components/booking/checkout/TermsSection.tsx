"use client";

import React, { useState, useCallback, useEffect } from "react";
import { TermsCheckbox } from "@/components/booking/TermsCheckbox";
import { TERMS_CONDITIONS } from "@/lib/constants/checkout-constants";

interface TermsSectionProps {
    onTermsChange: (allAccepted: boolean) => void;
}

const TermsSection = React.memo(({ onTermsChange }: TermsSectionProps) => {
    const [termsCon, setTermsCon] = useState({
        tcs1: false,
        tcs2: false,
        tcs3: false,
    });

    // Notify parent when terms state changes - use useEffect to avoid render-phase updates
    useEffect(() => {
        const allAccepted = Object.values(termsCon).every(Boolean);
        onTermsChange(allAccepted);
    }, [termsCon, onTermsChange]);

    const handleTermChange = useCallback((id: string, checked: boolean) => {
        setTermsCon((prev) => ({ ...prev, [id]: checked }));
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Terms & Conditions
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
                {TERMS_CONDITIONS.map((term) => (
                    <TermsCheckbox
                        key={term.id}
                        id={term.id}
                        label={term.label}
                        checked={termsCon[term.id as keyof typeof termsCon]}
                        onChange={(checked) => handleTermChange(term.id, checked)}
                    />
                ))}
            </div>
        </div>
    );
});

TermsSection.displayName = "TermsSection";

export default TermsSection;
