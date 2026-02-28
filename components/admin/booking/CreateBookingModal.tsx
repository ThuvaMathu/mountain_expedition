"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar } from "lucide-react";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

interface CreateBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productType: "trekking" | "tour";
}

export function CreateBookingModal({
    isOpen,
    onClose,
    onSuccess,
    productType,
}: CreateBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        source: "manual",
        mountainId: "",
        date: "",
        time: "06:00 AM",
        participants: 1,
        amount: 0,
        currency: "USD",
        status: "confirmed",
        organizerName: "",
        organizerEmail: "",
        organizerPhone: "",
        organizerCountry: "",
        organizerPassport: "",
        organizerEmergency: "",
        organizerMedical: "",
        paymentMethod: "Bank Transfer",
        notes: "",
    });

    // Fetch options (mountains/tours) when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchOptions = async () => {
                setFetchingOptions(true);
                try {
                    if (db) {
                        const mountainsSnap = await getDocs(collection(db, "mountains"));
                        const toursSnap = await getDocs(collection(db, "tourist-packages"));

                        const items: any[] = [];
                        mountainsSnap.forEach(doc => items.push({ id: doc.id, name: doc.data().name, type: 'trekking' }));
                        toursSnap.forEach(doc => items.push({ id: doc.id, name: doc.data().name, type: 'tour' }));

                        setOptions(items);
                    }
                } catch (error) {
                    console.error("Error fetching options", error);
                } finally {
                    setFetchingOptions(false);
                }
            };
            fetchOptions();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db || !isFirebaseConfigured) {
            alert("Database not configured");
            return;
        }

        if (!formData.mountainId) {
            alert("Please select a destination");
            return;
        }

        // Find selected item to get name
        const selectedItem = options.find(o => o.id === formData.mountainId);

        setLoading(true);

        try {
            const bookingId = `BK-${Date.now().toString().slice(-6)}`;

            const newBooking: Omit<TBooking, "id"> = {
                bookingId,
                booking: {
                    id: formData.mountainId,
                    type: selectedItem?.type || productType, // Use actual item type if available
                },
                mountainName: selectedItem?.name || "Unknown",
                amount: Number(formData.amount),
                currency: formData.currency,
                participants: Number(formData.participants),
                status: formData.status,
                paymentMethod: formData.paymentMethod,
                razorpayOrderId: "",
                razorpayPaymentId: "",
                createdAt: new Date().toISOString(),
                source: formData.source as "manual" | "enquiry" | "system",
                notes: formData.notes,
                slotDetails: {
                    id: `${formData.mountainId}-${formData.date}`,
                    date: formData.date,
                    time: formData.time,
                    maxParticipants: 20,
                    bookedParticipants: Number(formData.participants),
                    priceMultiplier: 1,
                },
                customerInfo: {
                    organizer: {
                        name: formData.organizerName,
                        email: formData.organizerEmail,
                        phone: formData.organizerPhone,
                        country: formData.organizerCountry,
                        passport: formData.organizerPassport,
                        emergencyContact: formData.organizerEmergency,
                        medicalInfo: formData.organizerMedical,
                    },
                    members: [],
                },
            };

            await addDoc(collection(db, "bookings"), {
                ...newBooking,
                createdAt: Timestamp.now(),
            });

            alert("Booking created successfully");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredOptions = options.filter(o => o.type === productType);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Create New Booking ({productType})</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Booking Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Trip Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Source *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                >
                                    <option value="manual">Manual Entry</option>
                                    <option value="enquiry">Enquiry / Lead</option>
                                    <option value="system">System (Online)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination *
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.mountainId}
                                    onChange={(e) => setFormData({ ...formData, mountainId: e.target.value })}
                                    disabled={fetchingOptions}
                                >
                                    <option value="">{fetchingOptions ? "Loading..." : "Select Destination"}</option>
                                    {filteredOptions.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <Input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <Input
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Participants *
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.participants}
                                    onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <Input
                                    required
                                    value={formData.organizerName}
                                    onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.organizerEmail}
                                    onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <Input
                                    value={formData.organizerPhone}
                                    onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <Input
                                    value={formData.organizerCountry}
                                    onChange={(e) => setFormData({ ...formData, organizerCountry: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Passport Number
                                </label>
                                <Input
                                    value={formData.organizerPassport}
                                    onChange={(e) => setFormData({ ...formData, organizerPassport: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Emergency Contact
                                </label>
                                <Input
                                    value={formData.organizerEmergency}
                                    onChange={(e) => setFormData({ ...formData, organizerEmergency: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Medical Info
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    rows={2}
                                    value={formData.organizerMedical}
                                    onChange={(e) => setFormData({ ...formData, organizerMedical: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Payment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                >
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Online">Online / Card</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Notes
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                rows={3}
                                placeholder="Internal notes about this booking..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Booking"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
