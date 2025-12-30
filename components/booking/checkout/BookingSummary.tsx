"use client";

import React, { useMemo } from "react";
import { User, Calendar, Mountain, Shield } from "lucide-react";
import { useCurrencyStore } from "@/stores/currency-store";
import { useBookingFormStore } from "@/stores/booking-form-store";
import { formatCurrency } from "@/lib/utils";
import { CurrencyButton } from "@/components/booking/CurrencyButton";
import { CHECKOUT_CONFIG } from "@/lib/constants/checkout-constants";
import PaymentButton from "./PaymentButton";

interface BookingSummaryProps {
    mountain: TMountainType | null;
    slotDate: string | undefined;
    isLoading: boolean;
    termsAccepted: boolean;
    onPayment: () => void;
}

const BookingSummary = React.memo(({
    mountain,
    slotDate,
    isLoading,
    termsAccepted,
    onPayment
}: BookingSummaryProps) => {
    const { currency, setCurrency, getCurrencyValue } = useCurrencyStore();

    // Subscribe to actual participant count from store (organizer + members)
    const participantCount = useBookingFormStore((state) => state.participantGroup.members.length + 1);

    // Calculate pricing - recalculates when currency or participant count changes
    const { unitPrice, basePrice, totalAmount } = useMemo(() => {
        const price = getCurrencyValue();
        const base = price! * participantCount;
        return {
            unitPrice: price,
            basePrice: base,
            totalAmount: base,
        };
    }, [participantCount, getCurrencyValue, currency]);

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Booking Summary
                    </h2>

                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={mountain?.imageUrl[0] || "/placeholder.svg"}
                            alt={mountain?.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {mountain?.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600">
                                <Mountain className="h-4 w-4 mr-1" />
                                <span>Expedition</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Date</span>
                            </div>
                            <span className="font-medium">{slotDate}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-1" />
                                <span>Participants</span>
                            </div>
                            <span className="font-medium">{participantCount}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Base price × {participantCount}
                            </span>
                            <span>
                                {unitPrice && formatCurrency(basePrice, currency)}
                            </span>
                        </div>

                        {currency === "INR" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">Note:</span> Base price already includes all applicable fees, GST (18%), and payment processing charges.
                                </p>
                            </div>
                        )}

                        {currency === "USD" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">Note:</span> Base price already includes all fees, taxes, and payment processing charges.
                                </p>
                            </div>
                        )}

                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(totalAmount, currency)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Currency Selector */}
                    <div className="border-t pt-4 mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <div className="flex gap-2">
                            {CHECKOUT_CONFIG.CURRENCIES.map((curr) => (
                                <CurrencyButton
                                    key={curr}
                                    value={curr}
                                    isActive={currency === curr}
                                    onClick={() => setCurrency(curr)}
                                />
                            ))}
                        </div>
                    </div>

                    <PaymentButton
                        isLoading={isLoading}
                        termsAccepted={termsAccepted}
                        onPayment={onPayment}
                    />

                    <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            <span>Secure Payment</span>
                        </div>
                        <span>•</span>
                        <span>Powered by Razorpay</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

BookingSummary.displayName = "BookingSummary";

export default BookingSummary;
