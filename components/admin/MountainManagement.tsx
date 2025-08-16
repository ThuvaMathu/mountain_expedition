"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, storage, isFirebaseConfigured } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Trash2, Edit3, Save, Plus } from "lucide-react"

type Mountain = {
  id?: string
  name: string
  altitude: number
  location: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: "seven-summits" | "himalayas" | "indian-peaks"
  bestSeason: string
  price: number
  availableDates: string[]
  imageUrl?: string
  description?: string
  createdAt?: any
}

const emptyMountain: Mountain = {
  name: "",
  altitude: 0,
  location: "",
  difficulty: "Intermediate",
  category: "himalayas",
  bestSeason: "",
  price: 0,
  availableDates: [],
  description: "",
}

export function MountainManagement() {
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [form, setForm] = useState<Mountain>(emptyMountain)
  const [dateInput, setDateInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains([])
      return
    }
    const snap = await getDocs(collection(db, "mountains"))
    const list: Mountain[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    setMountains(list)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const resetForm = () => {
    setForm(emptyMountain)
    setFile(null)
    setDateInput("")
    setEditingId(null)
  }

  const addDate = () => {
    if (dateInput && !form.availableDates.includes(dateInput)) {
      setForm({ ...form, availableDates: [...form.availableDates, dateInput] })
      setDateInput("")
    }
  }

  const removeDate = (d: string) => {
    setForm({ ...form, availableDates: form.availableDates.filter((x) => x !== d) })
  }

  const handleSave = async () => {
    setLoading(true)
    setNotice(null)
    try {
      let imageUrl = form.imageUrl
      if (file && isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `mountains/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        imageUrl = await getDownloadURL(storageRef)
      }

      const payload = {
        ...form,
        altitude: Number(form.altitude),
        price: Number(form.price),
        imageUrl: imageUrl || form.imageUrl || "",
        createdAt: serverTimestamp(),
      }

      if (!isFirebaseConfigured || !db) {
        // Demo mode
        if (editingId) {
          setMountains((prev) => prev.map((m) => (m.id === editingId ? { ...payload, id: editingId } : m)))
        } else {
          setMountains((prev) => [{ ...payload, id: `demo_${Date.now()}` }, ...prev])
        }
        resetForm()
        setNotice("Saved in demo mode (no Firebase).")
        return
      }

      if (editingId) {
        await updateDoc(doc(db, "mountains", editingId), payload as any)
        setNotice("Mountain updated.")
      } else {
        await addDoc(collection(db, "mountains"), payload as any)
        setNotice("Mountain created.")
      }
      await load()
      resetForm()
    } catch (e) {
      console.error(e)
      setNotice("Failed to save mountain.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (m: Mountain) => {
    setEditingId(m.id || null)
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
    })
    setFile(null)
    setDateInput("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm("Delete this mountain?")) return
    try {
      if (!isFirebaseConfigured || !db) {
        setMountains((prev) => prev.filter((m) => m.id !== id))
        return
      }
      await deleteDoc(doc(db, "mountains", id))
      await load()
    } catch (e) {
      console.error(e)
      alert("Failed to delete.")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mountain Management</h1>
        <p className="text-gray-600">Add new mountains (treated as products) and manage their details.</p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Demo Mode: Firebase not configured. Data will not persist.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altitude (m)</label>
            <Input
              type="number"
              value={form.altitude}
              onChange={(e) => setForm({ ...form, altitude: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as Mountain["difficulty"] })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Mountain["category"] })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
            >
              <option value="seven-summits">Seven Summits</option>
              <option value="himalayas">Himalayas</option>
              <option value="indian-peaks">Indian Peaks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Best Season</label>
            <Input value={form.bestSeason} onChange={(e) => setForm({ ...form, bestSeason: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (per person)</label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <div className="flex items-center gap-3">
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              {form.imageUrl && (
                <a href={form.imageUrl} target="_blank" className="text-teal-600 underline text-sm" rel="noreferrer">
                  Preview
                </a>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Dates</label>
          <div className="flex gap-2">
            <Input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="max-w-xs" />
            <Button type="button" variant="outline" onClick={addDate} className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          {form.availableDates.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.availableDates.map((d) => (
                <span
                  key={d}
                  className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs border border-teal-200"
                >
                  {new Date(d).toLocaleDateString()}
                  <button className="ml-2 text-red-600" onClick={() => removeDate(d)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" />
            {editingId ? "Update Mountain" : "Create Mountain"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} className="bg-transparent">
              Cancel
            </Button>
          )}
          {notice && <div className="text-sm text-gray-600 ml-2 self-center">{notice}</div>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Mountains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mountains.map((m) => (
            <div key={m.id} className="border rounded-lg p-4">
              {m.imageUrl && (
                <img
                  src={m.imageUrl || "/placeholder.svg"}
                  alt={m.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600">{m.location}</div>
              <div className="text-sm text-gray-600">
                {m.altitude.toLocaleString()} m • {m.difficulty}
              </div>
              <div className="text-sm text-gray-600">Season: {m.bestSeason}</div>
              <div className="text-sm text-teal-700 font-medium mt-1">${m.price?.toLocaleString()}</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(m)} className="bg-transparent">
                  <Edit3 className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        {mountains.length === 0 && (
          <div className="text-sm text-gray-600">No mountains yet. Use the form above to add one.</div>
        )}
      </div>
    </div>
  )
}
