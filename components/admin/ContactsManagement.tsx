"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Save } from "lucide-react"

type ContactConfig = {
  email: string
  phone: string
  address: string
}

export function ContactsManagement() {
  const [form, setForm] = useState<ContactConfig>({ email: "", phone: "", address: "" })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const load = async () => {
    if (!isFirebaseConfigured || !db) return
    const ref = doc(db, "settings", "contact")
    const snap = await getDoc(ref)
    if (snap.exists()) {
      setForm(snap.data() as any)
    }
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const save = async () => {
    setLoading(true)
    setNotice(null)
    try {
      if (!isFirebaseConfigured || !db) {
        setNotice("Saved (demo mode, not persisted).")
        setLoading(false)
        return
      }
      await setDoc(doc(db, "settings", "contact"), form)
      setNotice("Contact details updated.")
    } catch (e) {
      console.error(e)
      setNotice("Failed to save contact details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
        <p className="text-gray-600">Edit the website’s contact information.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={save} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          {notice && <div className="text-sm text-gray-600">{notice}</div>}
        </div>
      </div>
    </div>
  )
}
