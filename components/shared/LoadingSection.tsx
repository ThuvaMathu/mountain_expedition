import React from "react";

export function LoadingSection({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
