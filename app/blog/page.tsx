"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

type Post = {
  id: string
  slug: string
  title: string
  excerpt?: string
  date: string
  tags?: string[]
  mainImageUrl?: string
}

const fallbackPosts: Post[] = [
  {
    id: "1",
    slug: "everest-prep-guide",
    title: "Preparing for Everest: A Comprehensive Guide",
    excerpt: "Training, gear, and mindset for the world’s highest peak.",
    date: "2025-05-01",
    tags: ["Everest", "Training"],
    mainImageUrl: "/blog/everest.png",
  },
  {
    id: "2",
    slug: "himalayas-seasons",
    title: "Best Seasons to Trek the Himalayas",
    excerpt: "When to go and why it matters.",
    date: "2025-04-12",
    tags: ["Himalayas", "Planning"],
    mainImageUrl: "/blog/himalaya.png",
  },
  {
    id: "3",
    slug: "acclimatization-101",
    title: "Acclimatization 101: Stay Safe at Altitude",
    excerpt: "Physiology, symptoms, and strategies.",
    date: "2025-03-22",
    tags: ["Health", "Safety"],
    mainImageUrl: "/blog/denali.png",
  },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts)

  useEffect(() => {
    const load = async () => {
      if (!isFirebaseConfigured || !db) return
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      const data = snap.docs.map((d) => {
        const v = d.data() as any
        const item: Post = {
          id: d.id,
          slug: v.slug || d.id,
          title: v.title || "Untitled",
          excerpt: v.excerpt || (v.content ? stripHtml(v.content).slice(0, 160) + "…" : ""),
          date: v.date || new Date().toISOString().slice(0, 10),
          tags: v.tags || [],
          mainImageUrl: v.mainImageUrl || undefined,
        }
        return item
      })
      if (data.length) setPosts(data)
    }
    load().catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Stories, guides, and insights from the mountains.</p>
        </header>

        <section aria-label="Blog posts" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                <Image
                  src={p.mainImageUrl || "/placeholder.svg?height=360&width=640&query=mountain main image"}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900">{p.title}</h2>
                {p.excerpt ? <p className="text-gray-600 mt-2">{p.excerpt}</p> : null}
                <div className="text-sm text-gray-500 mt-3">{new Date(p.date).toLocaleDateString()}</div>
                {p.tags && p.tags.length ? (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function stripHtml(html: string) {
  if (!html) return ""
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, " ")
  const el = document.createElement("div")
  el.innerHTML = html
  return (el.textContent || el.innerText || "").trim()
}
