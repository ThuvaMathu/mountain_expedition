import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, packageId, packageName, packageType } = data;

    // Check if db is initialized
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database not available" },
        { status: 500 }
      );
    }

    // Save to Firestore enquiries collection
    await addDoc(collection(db, "enquiries"), {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message: message,
      packageId: packageId,
      packageName: packageName,
      packageType: packageType,
      status: "new",
      priority: "medium",
      createdAt: serverTimestamp(),
    });

    // TODO: Send email notification to admin
    // You can integrate with your existing email service here
    // For now, we're just saving to Firestore

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
