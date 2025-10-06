import { adminDb } from "@/lib/firebase-admin";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Metadata } from "next";
import { generateBlogDetailMetadata } from "@/seo/metadata/blog-detail";
import {
  generateBlogArticleSchema,
  generateBreadcrumbSchema,
} from "@/seo/schemas";

type TBlogPost = {
  id?: string;
  slug: string;
  title: string;
  desc: string;
  author: string;
  content: string;
  tags: string[];
  date: string;
  published: boolean;
  mainImageUrl?: string;
  createdAt?: string;
};

interface TBlogPostSEO {
  title: string;
  desc: string;
  mainImageUrl?: string;
}

// ✅ Pre-generate all blog post pages
export async function generateStaticParams() {
  const snapshot = await adminDb.collection("posts").get();
  return snapshot.docs.map((doc) => ({
    slug: doc.data().slug,
  }));
}

// ✅ Optionally set metadata dynamically for SEO

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Change the type of params
}): Promise<Metadata> {
  const { slug } = await params; // Await the params object

  const docSnap = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (docSnap.empty) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
      openGraph: {
        title: "Post Not Found",
        description: "The requested post could not be found.",
        images: [],
      },
    };
  }
  const post = docSnap.docs[0].data() as TBlogPost;
  return generateBlogDetailMetadata({
    title: post.title,
    description: post.desc,
    slug: slug,
    author: post.author,
    publishDate: post.createdAt,
    category: "Blog",
    image: post.mainImageUrl,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const docSnap = await adminDb
    .collection("posts")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (docSnap.empty) {
    notFound();
  }

  const post = {
    id: docSnap.docs[0].id,
    ...docSnap.docs[0].data(),
  } as TBlogPost;
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBlogArticleSchema({
              title: post.title,
              description: post.desc,
              author: post.author,
              publishDate: post?.createdAt || "",
              image: post.mainImageUrl || "",
              url: `/blog/${slug}`,
              keywords: post.tags,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
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
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
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
    </>
  );
}
