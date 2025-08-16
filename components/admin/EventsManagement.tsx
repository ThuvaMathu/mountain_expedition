"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, storage, isFirebaseConfigured } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Save, Trash2, Edit3 } from "lucide-react"

type EventItem = {
  id?: string
  title: string
  date: string
  description: string
  imageUrl?: string
}

const emptyEvent: EventItem = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  imageUrl: "",
}

export function EventsManagement() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [form, setForm] = useState<EventItem>(emptyEvent)
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setEvents([])
      return
    }
    const snap = await getDocs(collection(db, "events"))
    setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const reset = () => {
    setForm(emptyEvent)
    setEditingId(null)
    setFile(null)
  }

  const save = async () => {
    setLoading(true)
    try {
      let imageUrl = form.imageUrl
      if (file && isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        imageUrl = await getDownloadURL(storageRef)
      } else if (file) {
        imageUrl = URL.createObjectURL(file) // demo only
      }

      const payload = { ...form, imageUrl }
      if (!isFirebaseConfigured || !db) {
        if (editingId) {
          setEvents((prev) => prev.map((e) => (e.id === editingId ? { ...payload, id: editingId } : e)))
        } else {
          setEvents((prev) => [{ ...payload, id: `demo_${Date.now()}` } as any, ...prev])
        }
        reset()
        return
      }
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload as any)
      } else {
        await addDoc(collection(db, "events"), payload as any)
      }
      await load()
      reset()
    } catch (e) {
      console.error(e)
      alert("Failed to save event.")
    } finally {
      setLoading(false)
    }
  }

  const edit = (ev: EventItem) => {
    setEditingId(ev.id || null)
    setForm({ title: ev.title, date: ev.date, description: ev.description, imageUrl: ev.imageUrl })
    setFile(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const remove = async (id?: string) => {
    if (!id) return
    if (!confirm("Delete this event?")) return
    try {
      if (!isFirebaseConfigured || !db) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
      } else {
        await deleteDoc(doc(db, "events", id))
        await load()
      }
    } catch (e) {
      console.error(e)
      alert("Delete failed")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        <p className="text-gray-600">Add the latest events and achievements.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex items-center gap-3">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {form.imageUrl && (
              <a href={form.imageUrl} target="_blank" rel="noreferrer" className="text-teal-600 underline text-sm">
                Preview
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={save} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" /> {editingId ? "Update Event" : "Add Event"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={reset} className="bg-transparent">
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Events</h2>
        {events.length === 0 ? (
          <div className="text-sm text-gray-600">No events yet.</div>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    {ev.imageUrl && (
                      <img
                        src={ev.imageUrl || "/placeholder.svg"}
                        alt={ev.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{ev.title}</div>
                      <div className="text-xs text-gray-600">{new Date(ev.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-700 mt-1">{ev.description}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => edit(ev)} className="bg-transparent">
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(ev.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
