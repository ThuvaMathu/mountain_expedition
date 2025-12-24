import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db, isFirebaseConfigured, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Save, Trash2, Edit3 } from "lucide-react";
import dynamic from "next/dynamic";
import RichTextEditor from "./rich-text-editor";
import { ImageUploader } from "@/components/global/image-uploader";

// const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
//   ssr: false,
// }) as any;

const emptyPost: TBlogPostForm = {
  slug: "",
  title: "",
  desc: "",
  author: "",
  tags: [],
  date: new Date().toISOString().slice(0, 10),
  published: false,
  mainImageUrl: "",
  thumbnailUrl: "", // NEW: Thumbnail support
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogManagement() {
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [form, setForm] = useState<TBlogPostForm>(emptyPost);
  const [blogContent, setBlogContent] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canUseStorage = useMemo(() => isFirebaseConfigured && !!storage, []);

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setPosts([]);
      return;
    }
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setPosts(
      snap.docs.map((d) => {
        const v = d.data() as any;
        return {
          id: d.id,
          slug: v.slug || d.id,
          title: v.title || "",
          desc: v.desc || "",
          author: v.author || "",
          tags: v.tags || [],
          content: v.content || "",
          date: v.date || new Date().toISOString().slice(0, 10),
          published: !!v.published,
          mainImageUrl: v.mainImageUrl || "",
          thumbnailUrl: v.thumbnailUrl || "", // NEW: Load thumbnail
          createdAt: v.createdAt,
        };
      })
    );
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      slug: f.title ? slugify(f.title) : "",
      tags: tagsInput
        ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : [],
    }));
  }, [tagsInput, form.title]);

  const reset = () => {
    setForm(emptyPost);
    setBlogContent("");
    setTagsInput("");
    setEditingId(null);
  };

  const save = async () => {
    setLoading(true);
    try {
      const basePayload: any = {
        slug: form.slug || slugify(form.title || Date.now().toString()),
        title: form.title,
        content: blogContent,
        desc: form.desc,
        author: form.author,
        tags: form.tags,
        date: form.date,
        published: form.published || false,
        mainImageUrl: form.mainImageUrl || "",
        thumbnailUrl: form.thumbnailUrl || "", // NEW: Save thumbnail
      };

      if (!isFirebaseConfigured || !db) {
        // Demo mode updates local state
        if (editingId) {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === editingId ? { ...basePayload, id: editingId } : p
            )
          );
        } else {
          setPosts((prev) => [
            { ...basePayload, createdAt: new Date(), id: `demo_${Date.now()}` },
            ...prev,
          ]);
        }
        reset();
        return;
      }

      if (editingId) {
        // Update: set updatedAt
        await updateDoc(doc(db, "posts", editingId), {
          ...basePayload,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create: set createdAt
        await addDoc(collection(db, "posts"), {
          ...basePayload,
          createdAt: serverTimestamp()
        });
      }
      await load();
      reset();
    } catch (e) {
      console.error(e);
      alert("Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  // const edit = (p: Post) => {
  //   console.log("Editing post:", p);
  //   setEditingId(p.id || null);
  //   setForm({
  //     slug: p.slug,
  //     title: p.title,
  //     content: p.content,
  //     tags: p.tags || [],
  //     date: p.date,
  //     published: !!p.published,
  //     mainImageUrl: p.mainImageUrl || "",
  //   });
  //   setTagsInput((p.tags || []).join(", "));
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  const edit = (p: TBlogPost) => {
    const temp = {
      slug: p.slug,
      title: p.title,
      desc: p.desc,
      author: p.author,
      tags: p.tags || [],
      date: p.createdAt,
      published: !!p.published,
      mainImageUrl: p.mainImageUrl || "",
      thumbnailUrl: p.thumbnailUrl || "", // NEW: Load thumbnail for editing
    };
    console.log("Editing post:", p, "temp:", temp);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(p.id || null);
    setTagsInput((p.tags || []).join(", "));
    setForm(temp);
    setBlogContent(p.content || "");
    setTimeout(() => {
      setForm(temp);
      //console.log("Form after timeout:", form);
    }, 100);
  };

  //console.log("Rendering BlogManagement, posts:", form);
  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this post?")) return;
    try {
      if (!isFirebaseConfigured || !db) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        await deleteDoc(doc(db, "posts", id));
        await load();
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-gray-600">
          Create, edit, and delete blog posts. Upload a main image to feature on
          the blog.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        {/* Title, Date, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <Input
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: slugify(e.target.value) })
              }
              placeholder="auto-generated from title"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author (full name)
            </label>
            <Input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="John Doe"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Everest, Training"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (max 160 characters)
          </label>
          <Input
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            placeholder="Brief description of the blog post"
          />
          <p className="mt-1 text-xs text-gray-500">
            Keep it under 160 characters.
          </p>
        </div>
        {/* Main image uploader with thumbnail generation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <ImageUploader
            isMulti={false}
            bucketName="blog/main-images"
            onImageUpload={(urls) => setForm(f => ({ ...f, mainImageUrl: urls[0] || "" }))}
            initialUrls={form.mainImageUrl ? [form.mainImageUrl] : []}
            generateThumbnail={true}
            onThumbnailGenerated={(url) => setForm(f => ({ ...f, thumbnailUrl: url }))}
          />
          <p className="mt-2 text-xs text-gray-500">
            Recommended aspect ratio 16:10 or 16:9. Thumbnail will be generated automatically for faster page loads.
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <RichTextEditor
            value={blogContent}
            onChange={(html: string) => setBlogContent(html)}
            placeholder="Write your post..."
            className="rounded border"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={save}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Save className="h-4 w-4 mr-2" />{" "}
            {editingId ? "Update Post" : "Publish Post"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={reset}
              className="bg-transparent"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <div className="text-sm text-gray-600">No posts yet.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row gap-4 border rounded-lg p-4"
              >
                <div className="relative w-full md:w-52 aspect-[16/10] overflow-hidden rounded bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      p.mainImageUrl ||
                      "/placeholder.svg?height=200&width=320&query=blog card image"
                    }
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => edit(p)}
                        className="bg-transparent"
                      >
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                  {p.tags?.length ? (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
