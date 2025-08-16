"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, getDocs, limit, query, where } from "firebase/firestore"

type Post = {
  id: string
  slug: string
  title: string
  content: string
  date: string
  tags?: string[]
  mainImageUrl?: string
}

const fallbackPosts: Record<string, Post> = {
  "everest-prep-guide": {
    id: "1",
    slug: "everest-prep-guide",
    title: "Preparing for Everest: A Comprehensive Guide",
    content:
      "<p>Long-form article content about Everest prep... training plans, gear lists, and acclimatization strategies.</p>",
    date: "2025-05-01",
    tags: ["Everest", "Training"],
    mainImageUrl: "/blog/everest.png",
  },
  "himalayas-seasons": {
    id: "2",
    slug: "himalayas-seasons",
    title: "Best Seasons to Trek the Himalayas",
    content: "<p>Best time to trek and why seasonality matters for safety, views, and logistics.</p>",
    date: "2025-04-12",
    tags: ["Himalayas", "Planning"],
    mainImageUrl: "/blog/himalaya.png",
  },
  "acclimatization-101": {
    id: "3",
    slug: "acclimatization-101",
    title: "Acclimatization 101: Stay Safe at Altitude",
    content: "<p>How to acclimatize, understand AMS, and plan conservative ascent profiles for safety.</p>",
    date: "2025-03-22",
    tags: ["Health", "Safety"],
    mainImageUrl: "/blog/denali.png",
  },
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const slug = useMemo(() => params?.slug, [params])

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      if (!isFirebaseConfigured || !db) {
        setPost(fallbackPosts[slug] || null)
        return
      }
      const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1))
      const snap = await getDocs(q)
      if (!snap.empty) {
        const d = snap.docs[0]
        const v = d.data() as any
        setPost({
          id: d.id,
          slug: v.slug || d.id,
          title: v.title || "Untitled",
          content: v.content || "",
          date: v.date || new Date().toISOString().slice(0, 10),
          tags: v.tags || [],
          mainImageUrl: v.mainImageUrl || undefined,
        })
      } else {
        setPost(null)
      }
    }
    load().catch(console.error)
  }, [slug])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-gray-600">Post not found.</p>
        <Link href="/blog" className="text-teal-700 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow bg-gray-100">
          <Image
            src={post.mainImageUrl || "/placeholder.svg?height=600&width=1067&query=mountain hero image"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="text-sm text-gray-500 mt-1">{new Date(post.date).toLocaleDateString()}</div>

        {post.tags && post.tags.length ? (
          <div className="mt-3 flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="prose prose-teal max-w-none mt-6" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
