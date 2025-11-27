import { Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { generateContactMetadata } from "@/seo/metadata/contact";
import { localBusinessSchema, generateFAQSchema } from "@/seo/schemas";
import { getContactDetails } from "@/services/get-contact";

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
                Have a question about our expeditions or need help planning your
                adventure? Fill out the form below and we'll get back to you as
                soon as possible.
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
    </>
  );
}
