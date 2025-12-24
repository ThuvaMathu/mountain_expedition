"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ui/image-loader";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  desc: string;
  date: string;
  mainImageUrl: string;
  tags?: string[];
}

import { SlideUp, StaggerContainer, StaggerItem } from "../ui/motion-wrapper";

export function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!db) return;

        const q = query(
          collection(db, "posts"),
          orderBy("date", "desc"),
          limit(3)
        );

        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return null; // Or a skeleton loader if preferred
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SlideUp className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">From Our Blog</h2>
            <p className="text-gray-600 text-lg">
              Inspiration, tips & stories to help you travel better.
            </p>
          </div>
          <Link href="/blog" className="hidden md:block">
            <Button variant="outline" className="border-gray-200">
              View More
            </Button>
          </Link>
        </SlideUp>

        {/* Blog Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <StaggerItem key={post.id} className="h-full">
              <Link
                href={`/blog/${post.slug || post.id}`}
                className="group flex flex-col h-full"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <ImageLoader
                    src={post.mainImageUrl}
                    alt={post.title}
                    height="h-64"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.tags && post.tags.length > 0 && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-teal-700 uppercase tracking-wide">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 line-clamp-2 mb-4 text-sm flex-grow">
                    {post.desc}
                  </p>

                  <div className="flex items-center text-teal-600 font-semibold text-sm mt-auto">
                    Read Post <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-12 text-center md:hidden">
          <Link href="/blog">
            <Button variant="outline" className="border-gray-200 w-full">
              View More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
