import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin"; // ✅ use Admin SDK
import { Calendar, User, ArrowRight } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
import { organizationSchema } from "@/seo/schemas";
import { generateBlogMetadata } from "@/seo/metadata/blog";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export const revalidate = 60; // ✅ ISR: re-fetch data every 60s
export const metadata = generateBlogMetadata();
export default async function BlogPage() {
  let posts: TBlogPost[] = [];

  // Return early if Firebase Admin is not configured
  if (!adminDb) {
    posts = [];
  } else {
    try {
      const snap = await adminDb
        .collection("posts")
        .orderBy("date", "desc")
        .get();

      posts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TBlogPost[];
    } catch (error: any) {
      // Only log unexpected errors, NOT_FOUND is expected when collection doesn't exist
      if (error?.code !== 5 && !error?.message?.includes("NOT_FOUND")) {
        console.error("Error loading posts:", error);
      }
      posts = [];
    }
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Header */}
        <SlideUp className="text-center mb-12">
          <div className="inline-block">
            <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-4 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mountain Chronicles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories from the peaks, insights from the journey, and inspiration
            for your next adventure.
          </p>
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full mt-6 mx-auto" />
        </SlideUp>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available yet.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <StaggerItem key={post.id}>
                <article className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {(post.thumbnailUrl || post.mainImageUrl) && (
                    <div className="aspect-video overflow-hidden relative">
                      <ImageLoader
                        src={post.thumbnailUrl || post.mainImageUrl || "/placeholder.svg"}
                        alt={post.title}
                        height="h-56"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tags with animation */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full hover:bg-teal-200 transition-colors duration-200"
                          style={{
                            animationDelay: `${tagIndex * 50}ms`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors duration-200">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.desc}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {post.createdAt
                            ? (() => {
                              // Handle Firestore Timestamp format
                              let dateObj: Date;
                              if (typeof post.createdAt === "object" && "seconds" in post.createdAt) {
                                dateObj = new Date((post.createdAt as any).seconds * 1000);
                              } else {
                                dateObj = new Date(post.createdAt);
                              }

                              // Check if date is valid
                              if (isNaN(dateObj.getTime())) {
                                return new Date().toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                });
                              }

                              return dateObj.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                            })()
                            : ""}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium group/link"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
    </>
  );
}
