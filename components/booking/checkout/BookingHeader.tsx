import React from "react";

const BookingHeader = React.memo(() => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Booking
            </h1>
            <p className="text-gray-600">
                Secure your spot on this incredible expedition
            </p>
        </div>
    );
});

BookingHeader.displayName = "BookingHeader";

export default BookingHeader;
