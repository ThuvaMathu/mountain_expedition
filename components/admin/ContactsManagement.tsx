"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Plus, Trash2, Clock, Phone, HelpCircle } from "lucide-react";

type OfficeHours = {
  day: string;
  hours: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type ContactConfig = {
  email: string;
  phone: string;
  address: string;
  emergencyPhone: string;
  officeHours: OfficeHours[];
  faqs: FAQ[];
};

const defaultOfficeHours: OfficeHours[] = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const defaultFAQs: FAQ[] = [
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
];

export function ContactsManagement() {
  const [form, setForm] = useState<ContactConfig>({
    email: "",
    phone: "",
    address: "",
    emergencyPhone: "",
    officeHours: defaultOfficeHours,
    faqs: defaultFAQs,
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    if (!isFirebaseConfigured || !db) return;
    const ref = doc(db, "settings", "contact");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as Partial<ContactConfig>;
      setForm({
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        emergencyPhone: data.emergencyPhone || "",
        officeHours: data.officeHours || defaultOfficeHours,
        faqs: data.faqs || defaultFAQs,
      });
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const save = async () => {
    setLoading(true);
    setNotice(null);
    try {
      if (!isFirebaseConfigured || !db) {
        setNotice("Saved (demo mode, not persisted).");
        setLoading(false);
        return;
      }
      await setDoc(doc(db, "settings", "contact"), form);
      setNotice("Contact details updated successfully!");
    } catch (e) {
      console.error(e);
      setNotice("Failed to save contact details.");
    } finally {
      setLoading(false);
    }
  };

  const addOfficeHour = () => {
    setForm({
      ...form,
      officeHours: [...form.officeHours, { day: "", hours: "" }],
    });
  };

  const removeOfficeHour = (index: number) => {
    setForm({
      ...form,
      officeHours: form.officeHours.filter((_, i) => i !== index),
    });
  };

  const updateOfficeHour = (
    index: number,
    field: keyof OfficeHours,
    value: string
  ) => {
    const updated = [...form.officeHours];
    updated[index][field] = value;
    setForm({ ...form, officeHours: updated });
  };

  const addFAQ = () => {
    setForm({
      ...form,
      faqs: [...form.faqs, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index: number) => {
    setForm({
      ...form,
      faqs: form.faqs.filter((_, i) => i !== index),
    });
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...form.faqs];
    updated[index][field] = value;
    setForm({ ...form, faqs: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
        <p className="text-gray-600">
          Manage all contact information displayed on the website.
        </p>
      </div>

      {/* Basic Contact Information */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="info@tamiladventures.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Phone
            </label>
            <Input
              value={form.emergencyPhone}
              onChange={(e) =>
                setForm({ ...form, emergencyPhone: e.target.value })
              }
              placeholder="+91 98765 43211"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
              placeholder="123 Adventure Street, Chennai, Tamil Nadu 600001, India"
            />
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 text-teal-600 mr-2" />
            Office Hours
          </h2>
          <Button
            onClick={addOfficeHour}
            size="sm"
            variant="outline"
            className="text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Hours
          </Button>
        </div>
        <div className="space-y-3">
          {form.officeHours.map((hour, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  value={hour.day}
                  onChange={(e) =>
                    updateOfficeHour(index, "day", e.target.value)
                  }
                  placeholder="Day(s)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={hour.hours}
                  onChange={(e) =>
                    updateOfficeHour(index, "hours", e.target.value)
                  }
                  placeholder="Hours"
                />
              </div>
              <Button
                onClick={() => removeOfficeHour(index)}
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <HelpCircle className="h-5 w-5 text-teal-600 mr-2" />
            Frequently Asked Questions
          </h2>
          <Button
            onClick={addFAQ}
            size="sm"
            variant="outline"
            className="text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add FAQ
          </Button>
        </div>
        <div className="space-y-6">
          {form.faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  FAQ #{index + 1}
                </h3>
                <Button
                  onClick={() => removeFAQ(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <Input
                    value={faq.question}
                    onChange={(e) =>
                      updateFAQ(index, "question", e.target.value)
                    }
                    placeholder="Enter the question"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter the answer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 items-center">
          <Button
            onClick={save}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save All Changes"}
          </Button>
          {notice && (
            <div
              className={`text-sm px-3 py-1 rounded ${
                notice.includes("Failed")
                  ? "text-red-700 bg-red-50"
                  : "text-green-700 bg-green-50"
              }`}
            >
              {notice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
