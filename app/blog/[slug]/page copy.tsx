"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { demoPosts } from "@/lib/data/demo-data";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<TBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (isFirebaseConfigured && db) {
          const q = query(collection(db, "posts"), where("slug", "==", slug));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const doc = snap.docs[0];
            setPost({ id: doc.id, ...doc.data() } as TBlogPost);
          }
        } else {
          // Demo data

          const foundPost = demoPosts.find((p) => p.slug === slug);
          setPost(foundPost || null);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-8"
        >
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

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
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
  );
}
