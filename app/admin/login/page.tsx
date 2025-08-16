"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Mountain, Eye, EyeOff, LogIn } from "lucide-react"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      // Ensure user is admin in Firestore
      if (isFirebaseConfigured && db) {
        const userDoc = await getDoc(doc(db, "users", (await import("firebase/auth")).getAuth().currentUser!.uid))
        const isAdmin = userDoc.data()?.isAdmin
        if (!isAdmin) {
          setError("Access denied. This account is not an admin.")
          setLoading(false)
          return
        }
      }
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <Mountain className="h-12 w-12 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Admin Sign In</h1>
            <p className="text-gray-600 text-sm">Enter your admin credentials to access the panel.</p>
            {!isFirebaseConfigured && (
              <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-xs">
                Demo Mode: Firebase not configured. Any credentials will simulate admin access.
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 rounded-full border-b-2 border-white mr-2" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </div>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">This page is restricted to administrators only.</div>

            <div className="text-center text-sm">
              <Link href="/" className="text-teal-600 hover:underline">
                Back to site
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
