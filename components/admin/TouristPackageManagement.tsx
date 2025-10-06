"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Save,
  Plus,
  Globe,
  MapPin,
  Plane,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Users,
  Package,
  DollarSign,
  CheckCheck,
  Compass,
  Image,
} from "lucide-react";
import { ArrayInput } from "@/components/ui/array-input";
import { ItineraryInput } from "@/components/ui/itinerylist-adder";
import { ImageUploader } from "@/components/global/image-uploader";
import { CurrencyInput } from "../ui/currency-input";

// Empty tourist package structure
const emptyTouristPackage: TMountainType = {
  type: "tour",
  name: "",
  altitude: 0,
  location: "",
  difficulty: "Intermediate",
  bestSeason: "",
  price: 0,
  priceINR: 0,
  priceUSD: 0,
  availableDates: [],
  description: "",
  id: "",
  imageUrl: [],
  safetyRating: "Good",
  rating: 0,
  totalReviews: 0,
  availableSlots: 0,
  longDescription: "",
  duration: "",
  groupSize: "",
  included: [],
  notIncluded: [],
  itinerary: [],
  category: "domestic",
};
const emptySlot: TTimeSlot = {
  id: "",
  time: "06:00",
  maxParticipants: 10,
  bookedParticipants: 0,
  priceMultiplier: 1.0,
};
export default function TourAndTravelManagement() {
  const [touristPackages, setTouristPackages] = useState<TMountainType[]>([]);
  const [form, setForm] = useState<TMountainType>(emptyTouristPackage);
  // const [category, setCategory] = useState<"domestic" | "international">(
  //   "domestic"
  // );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [slotInput, setSlotInput] = useState<TTimeSlot>(emptySlot);
  const [expandedDates, setExpandedDates] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [initialUrls, setInitialUrls] = useState<string[]>([]);

  // Load function
  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setTouristPackages([]);
      return;
    }
    try {
      const snap = await getDocs(collection(db, "tourist-packages"));
      const list: TMountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setTouristPackages(list);
    } catch (error) {
      console.error("Error loading tourist packages:", error);
      setNotice("Failed to load tourist packages.");
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const resetForm = () => {
    setForm(emptyTouristPackage);
    //setCategory("domestic");
    setEditingId(null);
    setInitialUrls([]);
  };

  // Save or Update function
  const handleSave = async () => {
    // Validation
    if (!form.name.trim()) {
      setNotice("Package name is required");
      return;
    }
    if (!form.location.trim()) {
      setNotice("Location is required");
      return;
    }
    if (!form.duration.trim()) {
      setNotice("Duration is required");
      return;
    }
    if (!form.groupSize.trim()) {
      setNotice("Group size is required");
      return;
    }
    if (form.priceINR <= 0 || form.priceUSD <= 0) {
      setNotice("Both INR and USD prices are required");
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const payload = {
        ...form,
        //category, // Add category field
        updatedAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        setNotice("Failed to save package");
        return;
      }

      if (editingId) {
        // Update
        await updateDoc(doc(db, "tourist-packages", editingId), payload);
        setNotice("Package updated successfully!");
      } else {
        // Create
        const docRef = await addDoc(collection(db, "tourist-packages"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        await updateDoc(docRef, { id: docRef.id });
        setNotice("Package created successfully!");
      }

      await load();
      resetForm();
    } catch (error) {
      console.error("Error saving package:", error);
      setNotice("Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  // Edit function
  const handleEdit = (pkg: TMountainType) => {
    setForm(pkg);
    //setCategory((pkg as any).category || "domestic");
    setEditingId(pkg.id);
    setInitialUrls(pkg.imageUrl || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete function
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      if (!isFirebaseConfigured || !db) {
        setNotice("Error deleting package");
        return;
      }
      await deleteDoc(doc(db, "tourist-packages", id));
      await load();
      setNotice("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      setNotice("Failed to delete package");
    }
  };

  const toggleDateExpansion = (dateIndex: number) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateIndex)) {
      newExpanded.delete(dateIndex);
    } else {
      newExpanded.add(dateIndex);
    }
    setExpandedDates(newExpanded);
  };

  const addDateWithSlots = () => {
    if (dateInput) {
      const existingDateIndex = form.availableDates.findIndex(
        (d) => d.date === dateInput
      );
      if (existingDateIndex === -1) {
        setForm({
          ...form,
          availableDates: [
            ...form.availableDates,
            { date: dateInput, slots: [] },
          ],
        });
        setDateInput("");
        // Auto-expand the newly added date
        setExpandedDates(
          (prev) => new Set([...prev, form.availableDates.length])
        );
      } else {
        setNotice("Date already exists. Please choose a different date.");
        setTimeout(() => setNotice(null), 3000);
      }
    }
  };

  const addSlotToDate = (dateIndex: number) => {
    if (!slotInput.time) {
      setNotice("Please select a time for the slot.");
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    const updatedDates = [...form.availableDates];
    const newSlot = {
      ...slotInput,
      id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Check if time slot already exists for this date
    const existingSlot = updatedDates[dateIndex].slots.find(
      (slot) => slot.time === newSlot.time
    );
    if (existingSlot) {
      setNotice("Time slot already exists for this date.");
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    updatedDates[dateIndex].slots.push(newSlot);
    updatedDates[dateIndex].slots.sort((a, b) => a.time.localeCompare(b.time));
    setForm({ ...form, availableDates: updatedDates });
    setSlotInput({ ...emptySlot, id: "" });
  };

  const removeDate = (dateIndex: number) => {
    if (confirm("Remove this date and all its time slots?")) {
      const updatedDates = form.availableDates.filter(
        (_, index) => index !== dateIndex
      );
      setForm({ ...form, availableDates: updatedDates });
      // Update expanded dates indices
      const newExpanded = new Set<number>();
      expandedDates.forEach((index) => {
        if (index < dateIndex) {
          newExpanded.add(index);
        } else if (index > dateIndex) {
          newExpanded.add(index - 1);
        }
      });
      setExpandedDates(newExpanded);
    }
  };

  const removeSlot = (dateIndex: number, slotIndex: number) => {
    if (confirm("Remove this time slot?")) {
      const updatedDates = [...form.availableDates];
      updatedDates[dateIndex].slots = updatedDates[dateIndex].slots.filter(
        (_, index) => index !== slotIndex
      );
      setForm({ ...form, availableDates: updatedDates });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tourist Package Management
        </h1>
        <p className="text-gray-600">
          Create and manage tourist packages for both domestic and international
          destinations.
        </p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Firebase not configured. Data will not
            persist after page refresh.
          </div>
        )}
      </div>

      {/* Tourist Package Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingId ? "Edit Tourist Package" : "Add New Tourist Package"}
        </h2>

        {/* Category Selection */}
        <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Package Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  category: "domestic",
                })
              }
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                form.category === "domestic"
                  ? "border-teal-600 bg-teal-100 text-teal-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <MapPin className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Domestic</div>
                <div className="text-xs">India destinations</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  category: "international",
                })
              }
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                form.category === "international"
                  ? "border-teal-600 bg-teal-100 text-teal-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <Plane className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">International</div>
                <div className="text-xs">Global destinations</div>
              </div>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={
                form.category === "domestic"
                  ? "e.g., Golden Triangle Tour"
                  : "e.g., Paris & Swiss Alps Adventure"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={
                form.category === "domestic"
                  ? "e.g., Delhi, Agra, Jaipur"
                  : "e.g., Paris, France"
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Best Season
            </label>
            <Input
              value={form.bestSeason}
              onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
              placeholder="e.g., October to March, Year Round"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g., 7 Days / 6 Nights"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as TMountainType["difficulty"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="Beginner">Beginner - Easy & Relaxed</option>
              <option value="Intermediate">
                Intermediate - Moderate Activity
              </option>
              <option value="Advanced">Advanced - Active & Adventurous</option>
              <option value="Expert">Expert - Challenging Experience</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Rating
            </label>
            <select
              value={form.safetyRating}
              onChange={(e) =>
                setForm({
                  ...form,
                  safetyRating: e.target.value as TMountainType["safetyRating"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="Excellent">Excellent - Very Safe</option>
              <option value="Good">Good - Generally Safe</option>
              <option value="Average">Average - Moderate Precautions</option>
              <option value="Poor">Poor - Extra Precautions Needed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Size <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.groupSize}
            onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
            placeholder="e.g., 4-15 people"
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4"></h3>{" "}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-teal-600" />
          Pricing Information
        </h3>
        <div className=" grid grid-cols-2 border border-gray-300 rounded-md p-4 gap-4 w-full shadow shadow-teal-200 bg-teal-50">
          <div>
            <label className="block text-lg font-medium text-teal-700 mb-1">
              Base Price (INR) <span className="text-red-500">*</span>
            </label>
            <CurrencyInput
              value={form.priceINR}
              onChange={(value) => setForm({ ...form, priceINR: value })}
              placeholder="e.g., 65000"
              className="max-w-xs text-teal-700 font-medium"
              prefix="₹"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-teal-700 mb-1">
              Base Price (USD) <span className="text-red-500">*</span>
            </label>
            <CurrencyInput
              value={form.priceUSD}
              onChange={(value) => setForm({ ...form, priceUSD: value })}
              placeholder="e.g., 2800"
              className="max-w-xs text-teal-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-teal-600" />
          Package Description
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Brief overview of the package (2-3 sentences for card display)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description
            </label>
            <textarea
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Comprehensive description of the package, highlights, what makes it special..."
            />
          </div>
        </div>
      </div>

      {/* Category-Specific Information */}
      {form.category === "domestic" && (
        <div className="border-t pt-6 bg-blue-50 -mx-6 px-6 py-4">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Domestic Package Tips
            </h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Highlight cultural experiences and heritage sites</li>
            <li>Mention no visa requirements for Indian travelers</li>
            <li>Emphasize local cuisine and traditions</li>
            <li>Include regional festivals if applicable</li>
          </ul>
        </div>
      )}

      {form.category === "international" && (
        <div className="border-t pt-6 bg-purple-50 -mx-6 px-6 py-4">
          <div className="flex items-center space-x-2 mb-3">
            <Plane className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              International Package Tips
            </h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Mention visa requirements and assistance</li>
            <li>Include travel insurance information</li>
            <li>Highlight famous landmarks and attractions</li>
            <li>Mention currency exchange and local guides</li>
          </ul>
        </div>
      )}

      {/* Inclusions Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCheck className="h-5 w-5 mr-2 text-teal-600" />
          What's Included / Not Included
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's Included
            </label>
            <ArrayInput
              value={form.included}
              onChange={(values) => setForm({ ...form, included: values })}
              placeholder="e.g., Hotel accommodation"
              buttonLabel="Add"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's Not Included
            </label>
            <ArrayInput
              value={form.notIncluded}
              onChange={(values) => setForm({ ...form, notIncluded: values })}
              placeholder="e.g., Personal expenses"
              buttonLabel="Add"
            />
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Compass className="h-5 w-5 mr-2 text-teal-600" />
          Travel Itinerary
        </h3>
        <ItineraryInput
          value={form.itinerary}
          onChange={(items) => setForm({ ...form, itinerary: items })}
        />
      </div>

      {/* Image Upload Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Image className="h-5 w-5 mr-2 text-teal-600" />
          Package Images
        </h3>
        <ImageUploader
          isMulti={true}
          bucketName="tourist-packages"
          onImageUpload={(urls) => setForm({ ...form, imageUrl: urls })}
          initialUrls={initialUrls}
        />
      </div>
      {/* Available Dates & Time Slots Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Available Dates & Time Slots
        </h3>

        {/* Add New Date */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Date
          </label>
          <div className="flex gap-3">
            <Input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="max-w-xs"
              min={new Date().toISOString().split("T")[0]}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addDateWithSlots}
              className="bg-white hover:bg-gray-50"
              disabled={!dateInput}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Date
            </Button>
          </div>
        </div>

        {/* Existing Dates with Slots */}
        <div className="space-y-4">
          {form.availableDates.map((dateObj, dateIndex) => (
            <div
              key={dateIndex}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleDateExpansion(dateIndex)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium text-gray-900">
                    {new Date(dateObj.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>
                  <span className="text-sm text-gray-500">
                    ({dateObj.slots.length} slot
                    {dateObj.slots.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDate(dateIndex);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="text-gray-400">
                    {expandedDates.has(dateIndex) ? "−" : "+"}
                  </div>
                </div>
              </div>

              {expandedDates.has(dateIndex) && (
                <div className="p-4 bg-white">
                  {/* Add Slot to This Date */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={slotInput.time}
                        onChange={(e) =>
                          setSlotInput({ ...slotInput, time: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Max Participants
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={slotInput.maxParticipants}
                        onChange={(e) =>
                          setSlotInput({
                            ...slotInput,
                            maxParticipants: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Currently Booked
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={slotInput.bookedParticipants}
                        onChange={(e) =>
                          setSlotInput({
                            ...slotInput,
                            bookedParticipants: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => addSlotToDate(dateIndex)}
                        className=" bg-teal-200 hover:bg-teal-300 text-teal-800"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Add Slot
                      </Button>
                    </div>
                  </div>

                  {/* Existing Slots */}
                  {dateObj.slots.length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Time Slots:
                      </h5>
                      {dateObj.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {slot.bookedParticipants}/{slot.maxParticipants}{" "}
                                participants
                              </span>
                            </div>
                            {/* <div>
                              <span className="text-sm text-gray-600">
                                Price: $
                                {(
                                  form.price * slot.priceMultiplier
                                ).toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({slot.priceMultiplier}x)
                              </span>
                            </div> */}
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  slot.bookedParticipants >=
                                  slot.maxParticipants
                                    ? "bg-red-100 text-red-700"
                                    : slot.bookedParticipants >
                                      slot.maxParticipants * 0.8
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {slot.bookedParticipants >= slot.maxParticipants
                                  ? "Full"
                                  : `${
                                      slot.maxParticipants -
                                      slot.bookedParticipants
                                    } spots left`}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSlot(dateIndex, slotIndex)}
                            className="ml-3"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>
                        No time slots added yet. Use the form above to add
                        slots.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {form.availableDates.length === 0 && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No dates scheduled yet</p>
              <p className="text-sm">
                Add your first available date using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading
            ? "Saving..."
            : editingId
            ? "Update Package"
            : "Create Package"}
        </Button>
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="bg-white hover:bg-gray-50"
          >
            Cancel Edit
          </Button>
        )}
        {notice && (
          <div
            className={`text-sm px-3 py-2 rounded-md ${
              notice.includes("success") ||
              notice.includes("created") ||
              notice.includes("updated")
                ? "bg-green-100 text-green-700"
                : notice.includes("Failed") || notice.includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {notice}
          </div>
        )}
      </div>

      {/* Existing Packages List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-teal-600" />
          Existing Tourist Packages ({touristPackages.length})
        </h2>

        {/* Package Categories Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Domestic Packages</h3>
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {
                touristPackages.filter(
                  (pkg) => (pkg as any).category === "domestic"
                ).length
              }
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center space-x-2 mb-2">
              <Plane className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">
                International Packages
              </h3>
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {
                touristPackages.filter(
                  (pkg) => (pkg as any).category === "international"
                ).length
              }
            </p>
          </div>
        </div>

        {touristPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {touristPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {pkg.imageUrl && pkg.imageUrl.length > 0 ? (
                    <img
                      src={pkg.imageUrl[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Globe className="h-16 w-16" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    {(pkg as any).category === "domestic" ? (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Domestic
                      </span>
                    ) : (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Plane className="h-3 w-3 mr-1" />
                        International
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {pkg.name}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">{pkg.location}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {pkg.duration || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span
                        className={`font-medium px-2 py-0.5 rounded text-xs ${
                          pkg.difficulty === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : pkg.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : pkg.difficulty === "Advanced"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pkg.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-medium">
                        {pkg.groupSize || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-teal-600">
                          ₹{pkg.priceINR?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${pkg.priceUSD?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(pkg)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(pkg.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Globe className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              No tourist packages created yet
            </p>
            <p className="text-sm">
              Use the form above to add your first tourist package.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
