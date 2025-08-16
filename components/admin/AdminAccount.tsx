"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { Save, Shield } from "lucide-react"

export function AdminAccount() {
  const [email, setEmail] = useState(auth?.currentUser?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const reauth = async () => {
    if (!auth?.currentUser || !auth.currentUser.email) return
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
  }

  const saveEmail = async () => {
    setLoading(true)
    setNotice(null)
    try {
      if (!isFirebaseConfigured || !auth?.currentUser) {
        setNotice("Email updated (demo mode).")
        return
      }
      await reauth()
      await updateEmail(auth.currentUser, email)
      setNotice("Email updated successfully.")
    } catch (e: any) {
      console.error(e)
      setNotice(e?.message || "Failed to update email.")
    } finally {
      setLoading(false)
    }
  }

  const savePassword = async () => {
    setLoading(true)
    setNotice(null)
    try {
      if (!isFirebaseConfigured || !auth?.currentUser) {
        setNotice("Password updated (demo mode).")
        return
      }
      await reauth()
      await updatePassword(auth.currentUser, newPassword)
      setNotice("Password updated successfully.")
      setNewPassword("")
      setCurrentPassword("")
    } catch (e: any) {
      console.error(e)
      setNotice(e?.message || "Failed to update password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-teal-600" />
          Admin Account
        </h1>
        <p className="text-gray-600">Manage your admin credentials.</p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Demo Mode: Changes won’t persist.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Change Email</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="For re-authentication"
            />
          </div>
        </div>
        <Button onClick={saveEmail} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
          <Save className="h-4 w-4 mr-2" /> Update Email
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>
        </div>
        <Button onClick={savePassword} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
          <Save className="h-4 w-4 mr-2" /> Update Password
        </Button>
        {notice && <div className="text-sm text-gray-600">{notice}</div>}
      </div>
    </div>
  )
}
