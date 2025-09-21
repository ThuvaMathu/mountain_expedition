"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2, Edit3, ImageIcon, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import RichTextEditor from "./rich-text-editor";

// Using dynamic import for the rich text editor as it's a client-side library
const RichTextEditorComponent = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
}) as any;

type TEventItemForm = {
  id?: string;
  title: string;
  shortDesc: string;
  content: string;
  date: string;
  location: string;
  organizer: string;
  tags: string[];
  eventLink?: string;
  mainImageUrl?: string;
};

const emptyEvent: TEventItemForm = {
  title: "",
  shortDesc: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  organizer: "",
  tags: [],
  eventLink: "",
  mainImageUrl: "",
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function EventManagement() {
  const [events, setEvents] = useState<TEventItemForm[]>([]);
  const [form, setForm] = useState<TEventItemForm>(emptyEvent);
  const [content, setContent] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canUseStorage = useMemo(() => isFirebaseConfigured && !!storage, []);

  const loadEvents = async () => {
    if (!isFirebaseConfigured || !db) {
      setEvents([]);
      return;
    }
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setEvents(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TEventItemForm, "id">),
      }))
    );
  };

  useEffect(() => {
    loadEvents().catch(console.error);
  }, []);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      tags: tagsInput
        ? tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    }));
  }, [tagsInput]);

  const resetForm = () => {
    setForm(emptyEvent);
    setContent("");
    setTagsInput("");
    setEditingId(null);
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveEvent = async () => {
    setLoading(true);
    try {
      const payload: any = {
        ...form,
        content,
        tags: form.tags,
        createdAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        if (editingId) {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === editingId ? { ...payload, id: editingId } : e
            )
          );
        } else {
          setEvents((prev) => [
            { ...payload, id: `demo_${Date.now()}` },
            ...prev,
          ]);
        }
        resetForm();
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload);
      } else {
        await addDoc(collection(db, "events"), payload);
      }
      await loadEvents();
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  const editEvent = (event: TEventItemForm) => {
    setEditingId(event.id || null);
    setForm(event);
    setContent(event.content || "");
    setTagsInput((event.tags || []).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeEvent = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this event?")) return;
    try {
      if (!isFirebaseConfigured || !db) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        await deleteDoc(doc(db, "events", id));
        await loadEvents();
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setForm((f) => ({ ...f, mainImageUrl: localUrl }));

    if (!canUseStorage) {
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const key = `events/main-images/${Date.now()}_${file.name.replace(
        /\s+/g,
        "_"
      )}`;
      const refObj = storageRef(storage!, key);
      const task = uploadBytesResumable(refObj, file);

      task.on(
        "state_changed",
        (snap) => {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          setUploadProgress(Number(pct.toFixed(0)));
        },
        (err) => {
          console.error(err);
          alert("Upload failed");
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setForm((f) => ({ ...f, mainImageUrl: url }));
          setUploading(false);
        }
      );
    } catch (e) {
      console.error(e);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (!form.mainImageUrl) return;
    if (!confirm("Remove main image?")) return;

    if (canUseStorage && form.mainImageUrl.startsWith("https://")) {
      try {
        const r = storageRef(storage!, form.mainImageUrl);
        await deleteObject(r);
      } catch {
        // Ignore if not deletable
      }
    }
    setForm((f) => ({ ...f, mainImageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        <p className="text-gray-600">Add the latest events and achievements.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizer
            </label>
            <Input
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description (max 160 chars)
          </label>
          <Input
            value={form.shortDesc}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative w-full md:w-72 aspect-[16/10] overflow-hidden rounded-lg border bg-gray-50">
              {form.mainImageUrl ? (
                <img
                  src={form.mainImageUrl}
                  alt="Main"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
              {uploading ? (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-teal-600 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={handleSelectFile}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Upload className="h-4 w-4 mr-2" />{" "}
                {form.mainImageUrl ? "Replace Image" : "Upload Image"}
              </Button>
              {form.mainImageUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeImage}
                  className="bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" /> Remove
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Content
          </label>
          <RichTextEditorComponent
            value={content}
            onChange={(html: string) => setContent(html)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={saveEvent}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Save className="h-4 w-4 mr-2" />{" "}
            {editingId ? "Update Event" : "Add Event"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={resetForm}
              className="bg-transparent"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Past Events</h2>
        {events.length === 0 ? (
          <div className="text-sm text-gray-600">No events yet.</div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col md:flex-row gap-4 border rounded-lg p-4"
              >
                <div className="relative w-full md:w-52 aspect-[16/10] overflow-hidden rounded bg-gray-100">
                  <img
                    src={ev.mainImageUrl || "/placeholder.svg"}
                    alt={ev.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{ev.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(ev.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editEvent(ev)}
                        className="bg-transparent"
                      >
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeEvent(ev.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    {ev.shortDesc}
                  </div>
                  {ev.tags?.length ? (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {ev.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
