"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingFormStore } from "@/stores/booking-form-store";

interface PaymentButtonProps {
    isLoading: boolean;
    termsAccepted: boolean;
    onPayment: () => void;
}

const PaymentButton = React.memo(({ isLoading, termsAccepted, onPayment }: PaymentButtonProps) => {
    // Only subscribe to validation state
    const isFieldsFilled = useBookingFormStore((state) => state.isFieldsFilled);

    const isDisabled = isLoading || !isFieldsFilled || !termsAccepted;

    return (
        <div>
            <Button
                onClick={onPayment}
                disabled={isDisabled}
                className={`w-full mt-6 ${isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                    } text-white py-3 text-lg`}
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay Now
                    </div>
                )}
            </Button>
            {!isFieldsFilled && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                    Please fill in all required fields with valid information
                </p>
            )}
            {isFieldsFilled && !termsAccepted && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                    Please accept all terms and conditions to proceed
                </p>
            )}
        </div>
    );
});

PaymentButton.displayName = "PaymentButton";

export default PaymentButton;
