"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, storage, isFirebaseConfigured } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Upload, Trash2 } from "lucide-react"

type GalleryItem = {
  id?: string
  title: string
  url: string
  mountainId?: string
  createdAt?: any
}

export function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [mountainId, setMountainId] = useState("")
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setItems([])
      return
    }
    const snap = await getDocs(collection(db, "gallery"))
    setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const upload = async () => {
    if (!file) return
    setLoading(true)
    try {
      let url = ""
      if (isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        url = await getDownloadURL(storageRef)
      } else {
        url = URL.createObjectURL(file) // demo blob URL
      }
      const payload = {
        title: title || file.name,
        url,
        mountainId: mountainId || undefined,
        createdAt: serverTimestamp(),
      }
      if (!isFirebaseConfigured || !db) {
        setItems((prev) => [{ ...payload, id: `demo_${Date.now()}` } as any, ...prev])
      } else {
        await addDoc(collection(db, "gallery"), payload as any)
        await load()
      }
      setFile(null)
      setTitle("")
      setMountainId("")
    } catch (e) {
      console.error(e)
      alert("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id?: string) => {
    if (!id) return
    if (!confirm("Delete this image?")) return
    try {
      if (!isFirebaseConfigured || !db) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      } else {
        await deleteDoc(doc(db, "gallery", id))
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
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-600">Upload and organize images for your public gallery.</p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Demo Mode: Data won’t persist.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mountain ID (optional)</label>
            <Input value={mountainId} onChange={(e) => setMountainId(e.target.value)} placeholder="Link to mountain" />
          </div>
        </div>
        <Button onClick={upload} disabled={!file || loading} className="bg-teal-600 hover:bg-teal-700">
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        {items.length === 0 ? (
          <div className="text-sm text-gray-600">No images yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="border rounded-lg overflow-hidden">
                <img src={it.url || "/placeholder.svg"} alt={it.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <div className="font-medium">{it.title}</div>
                  {it.mountainId && <div className="text-xs text-gray-600">Mountain: {it.mountainId}</div>}
                  <div className="mt-2">
                    <Button size="sm" variant="destructive" onClick={() => remove(it.id)}>
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
