"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Calendar, User, ArrowLeft, Tag } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  slug: string
  mainImageUrl?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (isFirebaseConfigured && db) {
          const q = query(collection(db, "posts"), where("slug", "==", slug))
          const snap = await getDocs(q)
          if (!snap.empty) {
            const doc = snap.docs[0]
            setPost({ id: doc.id, ...doc.data() } as BlogPost)
          }
        } else {
          // Demo data
          const demoPosts = [
            {
              id: "1",
              title: "Conquering Everest: A Journey to the Top of the World",
              content: `
                <h2>The Ultimate Challenge</h2>
                <p>Standing at 29,032 feet above sea level, Mount Everest represents the ultimate challenge for any mountaineer. My journey to the summit in May 2023 was the culmination of years of preparation, training, and unwavering determination.</p>
                
                <h3>Preparation Phase</h3>
                <p>The preparation for Everest began months before the actual expedition. Physical conditioning, altitude training, and technical skill development were crucial components of my preparation strategy.</p>
                
                <h3>Base Camp to Summit</h3>
                <p>The journey from Base Camp to the summit involved multiple acclimatization rotations, each pushing the boundaries of human endurance. The final summit push was both physically and mentally demanding, requiring every ounce of strength and determination.</p>
                
                <h3>Lessons Learned</h3>
                <p>Everest taught me that preparation is everything, but adaptability is equally important. Weather conditions, team dynamics, and personal resilience all play crucial roles in determining success.</p>
              `,
              author: "N. Muthamizh Selvi",
              publishedAt: "2023-05-15",
              tags: ["Everest", "Himalayas", "Seven Summits"],
              slug: "conquering-everest-journey-top-world",
              mainImageUrl: "/blog/everest.png",
            },
            {
              id: "2",
              title: "The Beauty and Challenge of the Himalayas",
              content: `
                <h2>A Land of Contrasts</h2>
                <p>The Himalayas offer some of the most spectacular and challenging terrain on Earth. From the bustling streets of Kathmandu to the serene silence of high-altitude camps, every step of the journey reveals new wonders.</p>
                
                <h3>Cultural Richness</h3>
                <p>The people of the Himalayas have developed a unique culture adapted to life at high altitude. Their resilience, hospitality, and deep connection to the mountains provide valuable lessons for any visitor.</p>
                
                <h3>Environmental Challenges</h3>
                <p>Climate change is having a significant impact on the Himalayan region. Glacial retreat, changing weather patterns, and increased unpredictability make mountaineering more challenging than ever.</p>
              `,
              author: "N. Muthamizh Selvi",
              publishedAt: "2023-04-20",
              tags: ["Himalayas", "Culture", "Adventure"],
              slug: "beauty-challenge-himalayas",
              mainImageUrl: "/blog/himalaya.png",
            },
            {
              id: "3",
              title: "Denali: Surviving the Storm",
              content: `
                <h2>The Final Summit</h2>
                <p>Denali, the highest peak in North America, was the final mountain in my Seven Summits journey. What should have been a celebration nearly became a tragedy when a severe storm trapped our team near the summit.</p>
                
                <h3>The Storm Hits</h3>
                <p>The weather changed rapidly from clear skies to whiteout conditions. Wind speeds exceeded 60 mph, and temperatures dropped to life-threatening levels. Our carefully planned summit attempt became a fight for survival.</p>
                
                <h3>Emergency Protocols</h3>
                <p>Years of training and preparation kicked in as we implemented emergency protocols. Proper shelter construction, team communication, and systematic decision-making made the difference between life and death.</p>
                
                <h3>Lessons in Resilience</h3>
                <p>The experience on Denali reinforced that mountaineering is not just about reaching summits—it's about making smart decisions, supporting your team, and knowing when to push forward or retreat.</p>
                
                <h3>Completing the Seven Summits</h3>
                <p>Despite the challenges, we successfully summited Denali on June 16, 2025, completing my Seven Summits journey. This achievement represents not just personal accomplishment, but a testament to the power of preparation, teamwork, and perseverance.</p>
              `,
              author: "N. Muthamizh Selvi",
              publishedAt: "2025-06-20",
              tags: ["Denali", "Survival", "Resilience"],
              slug: "denali-surviving-storm",
              mainImageUrl: "/blog/denali.png",
            },
          ]

          const foundPost = demoPosts.find((p) => p.slug === slug)
          setPost(foundPost || null)
        }
      } catch (error) {
        console.error("Error loading post:", error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.mainImageUrl && (
            <div className="aspect-video lg:aspect-[21/9] overflow-hidden">
              <img
                src={post.mainImageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-teal-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            More Stories
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
