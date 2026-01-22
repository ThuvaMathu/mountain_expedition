'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  desc: string;
  date: string;
  mainImageUrl: string;
  tags?: string[];
  author?: string;
}

// Fallback data in case Firebase is unavailable
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'top-10-international-destinations-to-visit-in-2025',
    title: 'Top 10 International Destinations to Visit in.',
    desc: 'Discover the most breathtaking destinations around the world.',
    date: new Date('2024-12-01').toISOString(),
    mainImageUrl: '/images/gallery/img-60.jpg',
    tags: ['Travel Guides'],
    author: 'DexignZone',
  },
  {
    id: '2',
    slug: 'a-complete-travel-guide-to-exploring-europe-on-a-budget',
    title: 'A Complete Travel Guide to Exploring Europe.',
    desc: 'Learn how to explore Europe without breaking the bank.',
    date: new Date('2024-12-01').toISOString(),
    mainImageUrl: '/images/gallery/img-61.jpg',
    tags: ['Travel Tips'],
    author: 'DexignZone',
  },
  {
    id: '3',
    slug: 'hidden-paradise-15-underrated-places-you-must-visit-this-year',
    title: 'Hidden Paradise: 15 Underrated Places You Must.',
    desc: 'Explore hidden gems that most travelers miss.',
    date: new Date('2024-12-01').toISOString(),
    mainImageUrl: '/images/gallery/img-62.jpg',
    tags: ['Travel Guides'],
    author: 'DexignZone',
  },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!db) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'posts'),
          orderBy('date', 'desc'),
          limit(3)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const fetchedPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as BlogPost[];

          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  return (
    <section className="py-10 md:py-14 lg:py-16 relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore <span className="text-teal-500">Latest News</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Stay updated with our latest trekking adventures, travel tips, and mountain stories from the Himalayas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
            >
              See More Articles
            </Link>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => {
              const { day, month } = formatDate(post.date);

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <Image
                          src={post.mainImageUrl || '/images/gallery/img-60.jpg'}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={75}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-center">
                        <span className="block text-xl font-bold text-teal-600">{day}</span>
                        <span className="text-xs text-gray-600 uppercase">{month}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span>By {post.author || 'Admin'}</span>
                      </div>

                      <Link href={`/blog/${post.slug || post.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {post.desc && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.desc}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-md">
                          {post.tags[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
