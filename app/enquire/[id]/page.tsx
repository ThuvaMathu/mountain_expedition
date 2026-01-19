import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getContactDetails } from "@/services/get-contact";
import { getStats } from "@/services/get-stats";
import { getTestimonials } from "@/services/get-testimonials";

export default async function EnquirePage({ params }: { params: { id: string } }) {
    // Fetch package details from both collections
    let packageData = null;
    let packageType: "trekking" | "tour" = "trekking";

    // Try mountains collection first
    if (!db) return notFound();
    const mountainDoc = await getDoc(doc(db, "mountains", params.id));
    if (mountainDoc.exists()) {
        const data = mountainDoc.data();
        packageData = {
            id: mountainDoc.id,
            ...data,
            // Convert Firestore timestamps to strings
            createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        };
        packageType = "trekking";
    } else {
        // Try tourist-packages collection
        const tourDoc = await getDoc(doc(db, "tourist-packages", params.id));
        if (tourDoc.exists()) {
            const data = tourDoc.data();
            packageData = {
                id: tourDoc.id,
                ...data,
                // Convert Firestore timestamps to strings
                createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
            };
            packageType = "tour";
        }
    }

    if (!packageData) {
        notFound();
    }

    // Fetch contact details
    const contactDetails = await getContactDetails();

    // Fetch stats and testimonials for social trust
    const stats = await getStats("landing");
    const testimonials = await getTestimonials(5);

    return (
        <>
            <EnquiryForm
                packageData={packageData}
                packageType={packageType}
                contactDetails={contactDetails}
                stats={stats}
                testimonials={testimonials}
            />
        </>
    );
}
