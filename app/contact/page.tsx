import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { adminDb } from "@/lib/firebase-admin";
import { generateContactMetadata } from "@/seo/metadata/contact";
import { localBusinessSchema, generateFAQSchema } from "@/seo/schemas";

interface OfficeHours {
  day: string;
  hours: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ContactDetails {
  email: string;
  phone: string;
  address: string;
  emergencyPhone: string;
  officeHours: OfficeHours[];
  faqs: FAQ[];
}

async function getContactDetails(): Promise<ContactDetails> {
  // Default/fallback data
  const fallbackData: ContactDetails = {
    email: "info@tamiladventures.com",
    phone: "+91 98765 43210",
    address: "123 Adventure Street, Chennai, Tamil Nadu 600001, India",
    emergencyPhone: "+91 98765 43211",
    officeHours: [
      { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    faqs: [
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking at least 2-3 months in advance, especially for popular peaks during peak season.",
      },
      {
        question: "What's included in the expedition cost?",
        answer:
          "Our packages typically include guides, permits, base camp accommodation, and meals. Equipment rental available separately.",
      },
      {
        question: "Do you provide equipment?",
        answer:
          "Yes, we offer equipment rental for technical gear. Personal items like clothing and boots should be brought by participants.",
      },
      {
        question: "What fitness level is required?",
        answer:
          "Fitness requirements vary by expedition. We provide detailed preparation guides and fitness recommendations for each trip.",
      },
    ],
  };

  if (!adminDb) {
    console.warn("Firebase Admin not configured, using demo data");
    return fallbackData;
  }

  try {
    const contactDoc = await adminDb
      .collection("settings")
      .doc("contact")
      .get();

    if (contactDoc.exists) {
      const data = contactDoc.data() as Partial<ContactDetails>;

      // Merge with fallback data to ensure all fields are present
      return {
        email: data.email || fallbackData.email,
        phone: data.phone || fallbackData.phone,
        address: data.address || fallbackData.address,
        emergencyPhone: data.emergencyPhone || fallbackData.emergencyPhone,
        officeHours: data.officeHours || fallbackData.officeHours,
        faqs: data.faqs || fallbackData.faqs,
      };
    }
  } catch (error) {
    console.error("Error fetching contact details:", error);
  }

  return fallbackData;
}
export const metadata = generateContactMetadata();

export default async function ContactPage() {
  const contactDetails = await getContactDetails();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(contactDetails.faqs)),
        }}
      />{" "}
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                Ready for your next adventure? We're here to help you plan the
                perfect mountain expedition.
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Have a question about our expeditions or need help planning
                  your adventure? Fill out the form below and we'll get back to
                  you as soon as possible.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <ContactInfo contactDetails={contactDetails} />

              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-teal-600 mr-2" />
                  Office Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  {contactDetails.officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Emergency Contact
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  For expedition emergencies or urgent matters:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-teal-800">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {contactDetails.emergencyPhone}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Available 24/7 during active expeditions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactDetails.faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
