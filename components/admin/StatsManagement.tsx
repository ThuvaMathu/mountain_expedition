"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { Save, Trash2, Edit3 } from "lucide-react"

type Stat = {
  id?: string
  title: string
  value: string
  description?: string
}

const emptyStat: Stat = {
  title: "",
  value: "",
  description: "",
}

export function StatsManagement() {
  const [stats, setStats] = useState<Stat[]>([])
  const [form, setForm] = useState<Stat>(emptyStat)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setStats([])
      return
    }
    const snap = await getDocs(collection(db, "stats"))
    setStats(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const reset = () => {
    setForm(emptyStat)
    setEditingId(null)
  }

  const save = async () => {
    setLoading(true)
    try {
      const payload = { ...form }
      if (!isFirebaseConfigured || !db) {
        if (editingId) {
          setStats((prev) => prev.map((s) => (s.id === editingId ? { ...payload, id: editingId } : s)))
        } else {
          setStats((prev) => [{ ...payload, id: `demo_${Date.now()}` }, ...prev])
        }
        reset()
        return
      }
      if (editingId) {
        await updateDoc(doc(db, "stats", editingId), payload as any)
      } else {
        await addDoc(collection(db, "stats"), payload as any)
      }
      await load()
      reset()
    } catch (e) {
      console.error(e)
      alert("Failed to save.")
    } finally {
      setLoading(false)
    }
  }

  const edit = (s: Stat) => {
    setEditingId(s.id || null)
    setForm({ title: s.title, value: s.value, description: s.description })
  }

  const remove = async (id?: string) => {
    if (!id) return
    if (!confirm("Delete this stat?")) return
    try {
      if (!isFirebaseConfigured || !db) {
        setStats((prev) => prev.filter((s) => s.id !== id))
      } else {
        await deleteDoc(doc(db, "stats", id))
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
        <h1 className="text-2xl font-bold text-gray-900">Statistics Management</h1>
        <p className="text-gray-600">Add, edit, and delete stats shown across the site.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"} Stat
          </Button>
          {editingId && (
            <Button variant="outline" onClick={reset} className="bg-transparent">
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Stats</h2>
        {stats.length === 0 ? (
          <div className="text-sm text-gray-600">No stats yet.</div>
        ) : (
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-teal-700">{s.value}</div>
                  {s.description && <div className="text-sm text-gray-600">{s.description}</div>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => edit(s)} className="bg-transparent">
                    <Edit3 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
