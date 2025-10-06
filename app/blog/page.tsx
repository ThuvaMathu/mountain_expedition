import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { adminDb } from "@/lib/firebase-admin"; // ✅ use Admin SDK
import { Calendar, User, ArrowRight } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
import { organizationSchema } from "@/seo/schemas";
import { generateBlogMetadata } from "@/seo/metadata/blog";

export const revalidate = 60; // ✅ ISR: re-fetch data every 60s
export const metadata = generateBlogMetadata();
export default async function BlogPage() {
  let posts: TBlogPost[] = [];

  try {
    const snap = await adminDb
      .collection("posts")
      .orderBy("date", "desc")
      .get();

    posts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TBlogPost[];
  } catch (error) {
    console.error("Error loading posts:", error);
    posts = [];
  }

  return (
    <>
      {" "}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />{" "}
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mountain Chronicles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stories from the peaks, insights from the journey, and inspiration
              for your next adventure.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {post.mainImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <ImageLoader
                        src={post.mainImageUrl || "/placeholder.svg"}
                        alt={post.title}
                        height="h-56"
                        priority
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.desc}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
