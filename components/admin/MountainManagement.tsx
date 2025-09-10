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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Trash2,
  Edit3,
  Save,
  Plus,
  Clock,
  Users,
  Calendar,
  Mountain,
} from "lucide-react";

type TimeSlot = {
  id: string;
  time: string;
  maxParticipants: number;
  bookedParticipants: number;
  priceMultiplier: number;
};

type MountainType = {
  id?: string;
  name: string;
  altitude: number;
  location: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: "seven-summits" | "himalayas" | "indian-peaks";
  bestSeason: string;
  price: number;
  availableDates: Array<{
    date: string;
    slots: TimeSlot[];
  }>;
  imageUrl?: string;
  description?: string;
  createdAt?: any;
};

const emptyMountain: MountainType = {
  name: "",
  altitude: 0,
  location: "",
  difficulty: "Intermediate",
  category: "himalayas",
  bestSeason: "",
  price: 0,
  availableDates: [],
  description: "",
};

const emptySlot: TimeSlot = {
  id: "",
  time: "06:00",
  maxParticipants: 10,
  bookedParticipants: 0,
  priceMultiplier: 1.0,
};

export function MountainManagement() {
  const [mountains, setMountains] = useState<MountainType[]>([]);
  const [form, setForm] = useState<MountainType>(emptyMountain);
  const [dateInput, setDateInput] = useState("");
  const [slotInput, setSlotInput] = useState<TimeSlot>(emptySlot);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<number>>(new Set());

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      // Demo data for when Firebase is not configured
      const demoMountains: MountainType[] = [
        {
          id: "demo_1",
          name: "Mount Everest",
          altitude: 8849,
          location: "Nepal/Tibet",
          difficulty: "Expert",
          category: "seven-summits",
          bestSeason: "April-May, September-October",
          price: 65000,
          availableDates: [
            {
              date: "2024-05-15",
              slots: [
                {
                  id: "slot_1",
                  time: "04:00",
                  maxParticipants: 8,
                  bookedParticipants: 6,
                  priceMultiplier: 1.2,
                },
                {
                  id: "slot_2",
                  time: "06:00",
                  maxParticipants: 10,
                  bookedParticipants: 8,
                  priceMultiplier: 1.0,
                },
              ],
            },
            {
              date: "2024-05-20",
              slots: [
                {
                  id: "slot_3",
                  time: "05:00",
                  maxParticipants: 12,
                  bookedParticipants: 4,
                  priceMultiplier: 1.0,
                },
              ],
            },
          ],
          imageUrl: "/mount-everest-summit.png",
          description:
            "The world's highest peak, offering the ultimate mountaineering challenge.",
        },
        {
          id: "demo_2",
          name: "Kilimanjaro",
          altitude: 5895,
          location: "Tanzania",
          difficulty: "Intermediate",
          category: "seven-summits",
          bestSeason: "June-October, December-March",
          price: 3500,
          availableDates: [
            {
              date: "2024-03-20",
              slots: [
                {
                  id: "slot_4",
                  time: "06:00",
                  maxParticipants: 15,
                  bookedParticipants: 12,
                  priceMultiplier: 1.0,
                },
                {
                  id: "slot_5",
                  time: "08:00",
                  maxParticipants: 15,
                  bookedParticipants: 8,
                  priceMultiplier: 0.9,
                },
              ],
            },
          ],
          imageUrl: "/mount-kilimanjaro-acacia.png",
          description:
            "Africa's highest peak, accessible to climbers of various skill levels.",
        },
      ];
      setMountains(demoMountains);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "mountains"));
      const list: MountainType[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setMountains(list);
    } catch (error) {
      console.error("Error loading mountains:", error);
      setNotice("Failed to load mountains.");
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const resetForm = () => {
    setForm(emptyMountain);
    setFile(null);
    setDateInput("");
    setSlotInput({ ...emptySlot, id: "" });
    setEditingId(null);
    setExpandedDates(new Set());
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

  const updateSlot = (
    dateIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: any
  ) => {
    const updatedDates = [...form.availableDates];
    updatedDates[dateIndex].slots[slotIndex] = {
      ...updatedDates[dateIndex].slots[slotIndex],
      [field]: value,
    };
    setForm({ ...form, availableDates: updatedDates });
  };

  const handleSave = async () => {
    if (!form.name || !form.location || form.altitude <= 0 || form.price <= 0) {
      setNotice("Please fill in all required fields.");
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    setLoading(true);
    setNotice(null);
    try {
      let imageUrl = form.imageUrl;
      if (file && isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `mountains/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        ...form,
        altitude: Number(form.altitude),
        price: Number(form.price),
        imageUrl: imageUrl || form.imageUrl || "",
        createdAt: editingId ? form.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        // Demo mode
        if (editingId) {
          setMountains((prev) =>
            prev.map((m) =>
              m.id === editingId ? { ...payload, id: editingId } : m
            )
          );
          setNotice("Mountain updated in demo mode.");
        } else {
          const newMountain = { ...payload, id: `demo_${Date.now()}` };
          setMountains((prev) => [newMountain, ...prev]);
          setNotice("Mountain created in demo mode.");
        }
        resetForm();
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, "mountains", editingId), payload as any);
        setNotice("Mountain updated successfully.");
      } else {
        await addDoc(collection(db, "mountains"), payload as any);
        setNotice("Mountain created successfully.");
      }
      await load();
      resetForm();
    } catch (e) {
      console.error(e);
      setNotice("Failed to save mountain. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  const handleEdit = (m: MountainType) => {
    setEditingId(m.id || null);
    setForm({
      name: m.name,
      altitude: m.altitude,
      location: m.location,
      difficulty: m.difficulty,
      category: m.category,
      bestSeason: m.bestSeason,
      price: m.price,
      availableDates: m.availableDates || [],
      imageUrl: m.imageUrl,
      description: m.description || "",
      createdAt: m.createdAt,
    });
    setFile(null);
    setDateInput("");
    setSlotInput({ ...emptySlot, id: "" });
    setExpandedDates(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (
      !confirm(
        "Delete this mountain and all its bookings? This action cannot be undone."
      )
    )
      return;

    try {
      if (!isFirebaseConfigured || !db) {
        setMountains((prev) => prev.filter((m) => m.id !== id));
        setNotice("Mountain deleted in demo mode.");
        setTimeout(() => setNotice(null), 3000);
        return;
      }
      await deleteDoc(doc(db, "mountains", id));
      await load();
      setNotice("Mountain deleted successfully.");
      setTimeout(() => setNotice(null), 3000);
    } catch (e) {
      console.error(e);
      setNotice("Failed to delete mountain.");
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const getTotalSlots = (mountain: MountainType) => {
    return (
      mountain.availableDates?.reduce(
        (total, date) => total + date.slots.length,
        0
      ) || 0
    );
  };

  const getAvailableSlots = (mountain: MountainType) => {
    return (
      mountain.availableDates?.reduce((total, date) => {
        return (
          total +
          date.slots.reduce((dateTotal, slot) => {
            return (
              dateTotal +
              Math.max(0, slot.maxParticipants - slot.bookedParticipants)
            );
          }, 0)
        );
      }, 0) || 0
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mountain Management
        </h1>
        <p className="text-gray-600">
          Create and manage mountain expeditions with comprehensive scheduling
          and slot management.
        </p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Firebase not configured. Data will not
            persist after page refresh.
          </div>
        )}
      </div>

      {/* Mountain Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingId ? "Edit Mountain" : "Add New Mountain"}
        </h2>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mountain Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Mount Everest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Nepal/Tibet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altitude (meters) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              value={form.altitude}
              onChange={(e) =>
                setForm({ ...form, altitude: Number(e.target.value) })
              }
              placeholder="e.g., 8849"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as MountainType["difficulty"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as MountainType["category"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="seven-summits">Seven Summits</option>
              <option value="himalayas">Himalayas</option>
              <option value="indian-peaks">Indian Peaks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Best Season
            </label>
            <Input
              value={form.bestSeason}
              onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
              placeholder="e.g., April-May, September-October"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price (USD) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              placeholder="e.g., 65000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              {form.imageUrl && (
                <a
                  href={form.imageUrl}
                  target="_blank"
                  className="text-teal-600 hover:text-teal-700 underline text-sm whitespace-nowrap"
                  rel="noreferrer"
                >
                  View Current
                </a>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the mountain, climbing routes, challenges, and what makes it special..."
            />
          </div>
        </div>

        {/* Available Dates and Slots Management */}
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
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
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price Multiplier
                        </label>
                        <Input
                          type="number"
                          min="0.1"
                          max="3.0"
                          step="0.1"
                          value={slotInput.priceMultiplier}
                          onChange={(e) =>
                            setSlotInput({
                              ...slotInput,
                              priceMultiplier: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSlotToDate(dateIndex)}
                          className="w-full bg-white hover:bg-gray-50"
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
                                  {slot.bookedParticipants}/
                                  {slot.maxParticipants} participants
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">
                                  Price: $
                                  {(
                                    form.price * slot.priceMultiplier
                                  ).toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({slot.priceMultiplier}x)
                                </span>
                              </div>
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
                                  {slot.bookedParticipants >=
                                  slot.maxParticipants
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
                <p className="text-lg font-medium mb-2">
                  No dates scheduled yet
                </p>
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
              ? "Update Mountain"
              : "Create Mountain"}
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
      </div>

      {/* Existing Mountains List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Mountain className="h-5 w-5 mr-2 text-teal-600" />
          Existing Mountains ({mountains.length})
        </h2>

        {mountains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mountains.map((m) => (
              <div
                key={m.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {m.imageUrl && (
                  <img
                    src={m.imageUrl || "/placeholder.svg"}
                    alt={m.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {m.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.difficulty === "Expert"
                          ? "bg-red-100 text-red-700"
                          : m.difficulty === "Advanced"
                          ? "bg-orange-100 text-orange-700"
                          : m.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {m.difficulty}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <span className="font-medium">Location:</span>
                      <span className="ml-1">{m.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Altitude:</span>
                      <span className="ml-1">
                        {m.altitude.toLocaleString()} m
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Season:</span>
                      <span className="ml-1">{m.bestSeason}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-teal-700">
                      ${m.price?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {m.availableDates?.length || 0} dates • {getTotalSlots(m)}{" "}
                      slots
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">
                        {getAvailableSlots(m)}
                      </span>
                      <span className="text-gray-500"> spots available</span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {m.category.replace("-", " ")}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(m)}
                      className="flex-1 bg-white hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(m.id)}
                      className="flex-1"
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
            <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No mountains created yet</p>
            <p className="text-sm">
              Use the form above to add your first mountain expedition.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
