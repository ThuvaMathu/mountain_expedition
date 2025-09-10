import React from "react";

function GlobalLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
        </div>
      </main>
    </div>
  );
}

export default GlobalLoader;
