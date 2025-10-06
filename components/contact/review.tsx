"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ReviewSubmissionForm from "@/components/contact/ReviewSubmissionForm";
export default function ReviewMain() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <ReviewSubmissionForm />
        </main>

        <Footer />
      </div>
    </>
  );
}
