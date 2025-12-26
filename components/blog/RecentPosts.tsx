"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    desc: string;
    thumbnailUrl?: string;
    mainImageUrl?: string;
    createdAt: any;
    published?: boolean;
}

interface RecentPostsProps {
    currentSlug: string;
    limit?: number;
}

export function RecentPosts({ currentSlug, limit: postLimit = 3 }: RecentPostsProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                if (!db) {
                    console.log("Firebase not initialized");
                    setLoading(false);
                    return;
                }

                // Try to fetch posts - if composite index doesn't exist, try without published filter
                let q;
                try {
                    q = query(
                        collection(db, "posts"),
                        where("published", "==", true),
                        orderBy("createdAt", "desc"),
                        limit(postLimit + 1)
                    );
                    const snapshot = await getDocs(q);
                    const fetchedPosts = snapshot.docs
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as BlogPost))
                        .filter(post => post.slug !== currentSlug)
                        .slice(0, postLimit);

                    console.log("Fetched posts:", fetchedPosts.length);
                    setPosts(fetchedPosts);
                } catch (indexError: any) {
                    console.warn("Composite index query failed, trying without published filter:", indexError.message);
                    // Fallback: fetch all posts and filter client-side
                    q = query(
                        collection(db, "posts"),
                        orderBy("createdAt", "desc"),
                        limit(postLimit + 5) // Get extra to account for filtering
                    );
                    const snapshot = await getDocs(q);
                    const fetchedPosts = snapshot.docs
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as BlogPost))
                        .filter(post => post.slug !== currentSlug && post.published !== false)
                        .slice(0, postLimit);

                    console.log("Fetched posts (fallback):", fetchedPosts.length);
                    setPosts(fetchedPosts);
                }
            } catch (error) {
                console.error("Error fetching recent posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentPosts();
    }, [currentSlug, postLimit]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (posts.length === 0) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";

        let dateObj: Date;
        if (typeof timestamp === "object" && "seconds" in timestamp) {
            dateObj = new Date(timestamp.seconds * 1000);
        } else {
            dateObj = new Date(timestamp);
        }

        if (isNaN(dateObj.getTime())) return "";

        return dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Posts</h3>
            <div className="space-y-6">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block"
                    >
                        <div className="flex gap-4">
                            {(post.thumbnailUrl || post.mainImageUrl) && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={post.thumbnailUrl || post.mainImageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-1">
                                    {post.title}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(post.createdAt)}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Link
                href="/blog"
                className="mt-6 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
                View all posts
                <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
        </div>
    );
}
