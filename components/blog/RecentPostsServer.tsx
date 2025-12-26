import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    desc: string;
    thumbnailUrl?: string;
    mainImageUrl?: string;
    createdAt: any;
}

interface RecentPostsServerProps {
    currentSlug: string;
    limit?: number;
}

export async function RecentPostsServer({ currentSlug, limit = 3 }: RecentPostsServerProps) {
    let posts: BlogPost[] = [];

    try {
        if (!adminDb) {
            console.log("Admin DB not initialized");
            return null;
        }

        const snapshot = await adminDb
            .collection("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .limit(limit + 1)
            .get();

        posts = snapshot.docs
            .map(doc => ({
                id: doc.id,
                slug: doc.data().slug,
                title: doc.data().title,
                desc: doc.data().desc,
                thumbnailUrl: doc.data().thumbnailUrl,
                mainImageUrl: doc.data().mainImageUrl,
                createdAt: doc.data().createdAt,
            }))
            .filter(post => post.slug !== currentSlug)
            .slice(0, limit);

    } catch (error) {
        console.error("Error fetching recent posts:", error);
        return null;
    }

    if (posts.length === 0) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";

        let dateObj: Date;
        if (typeof timestamp === "object" && "seconds" in timestamp) {
            dateObj = new Date(timestamp.seconds * 1000);
        } else if (timestamp._seconds) {
            dateObj = new Date(timestamp._seconds * 1000);
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
