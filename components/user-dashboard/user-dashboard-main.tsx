"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Mountain,
  DollarSign,
  User,
  Upload,
  ImageIcon,
  X,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { capitalizeName, formatCurrency } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface JourneyImage {
  id: string;
  url: string;
  caption: string;
  mountainName: string;
  uploadedAt: any;
}

interface ExperienceSubmission {
  id: string;
  title: string;
  description: string;
  mountainName: string;
  rating: number;
  images: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  userName: string;
  userEmail: string;
}

export default function DashboardPageMain() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [journeyImages, setJourneyImages] = useState<JourneyImage[]>([]);
  const [experienceSubmissions, setExperienceSubmissions] = useState<
    ExperienceSubmission[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingExperience, setUploadingExperience] = useState(false);
  const [imageForm, setImageForm] = useState({
    file: null as File | null,
    caption: "",
    mountainName: "",
  });

  const [experienceForm, setExperienceForm] = useState({
    title: "",
    description: "",
    mountainName: "",
    rating: 5,
    images: [] as File[],
  });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        if (isFirebaseConfigured && db) {
          // Load bookings
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("userEmail", "==", user.email)
          );
          const bookingsSnap = await getDocs(bookingsQuery);
          const bookingsList: TBooking[] = bookingsSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as any)
          );
          setBookings(bookingsList);

          // Load journey images
          const imagesQuery = query(
            collection(db, "journeyImages"),
            where("userEmail", "==", user.email)
          );
          const imagesSnap = await getDocs(imagesQuery);
          const imagesList: JourneyImage[] = imagesSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as any)
          );
          setJourneyImages(imagesList);

          const experiencesQuery = query(
            collection(db, "experienceSubmissions"),
            where("userEmail", "==", user.email)
          );
          const experiencesSnap = await getDocs(experiencesQuery);
          const experiencesList: ExperienceSubmission[] =
            experiencesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          setExperienceSubmissions(experiencesList);
        } else {
          // Demo data
          setBookings([]);
          setJourneyImages([]);
          setExperienceSubmissions([
            {
              id: "exp1",
              title: "Amazing Everest Base Camp Trek",
              description:
                "The journey to Everest Base Camp was absolutely incredible. The views were breathtaking and the experience was life-changing.",
              mountainName: "Mount Everest",
              rating: 5,
              images: ["/placeholder.svg"],
              status: "approved",
              submittedAt: new Date(),
              userName: user?.displayName || "Demo User",
              userEmail: user?.email || "demo@example.com",
            },
          ]);
        }
      } catch (e) {
        console.error(e);
        setBookings([]);
        setJourneyImages([]);
        setExperienceSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (!loading) load();
  }, [user, loading]);

  const handleImageUpload = async () => {
    if (
      !imageForm.file ||
      !imageForm.caption ||
      !imageForm.mountainName ||
      !user
    )
      return;

    setUploadingImage(true);
    try {
      let imageUrl = "";

      if (isFirebaseConfigured && storage && db) {
        // Upload to Firebase Storage
        const storageRef = ref(
          storage,
          `journey-images/${user.uid}/${Date.now()}_${imageForm.file.name}`
        );
        await uploadBytes(storageRef, imageForm.file);
        imageUrl = await getDownloadURL(storageRef);

        // Save to Firestore
        await addDoc(collection(db, "journeyImages"), {
          url: imageUrl,
          caption: imageForm.caption,
          mountainName: imageForm.mountainName,
          userEmail: user.email,
          userName: user || "Anonymous",
          uploadedAt: serverTimestamp(),
        });

        // Reload images
        const imagesQuery = query(
          collection(db, "journeyImages"),
          where("userEmail", "==", user.email)
        );
        const imagesSnap = await getDocs(imagesQuery);
        const imagesList: JourneyImage[] = imagesSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as any)
        );
        setJourneyImages(imagesList);
      } else {
        // Demo mode - create local preview
        const demoImage: JourneyImage = {
          id: `demo_${Date.now()}`,
          url: URL.createObjectURL(imageForm.file),
          caption: imageForm.caption,
          mountainName: imageForm.mountainName,
          uploadedAt: new Date(),
        };
        setJourneyImages((prev) => [demoImage, ...prev]);
      }

      // Reset form
      setImageForm({ file: null, caption: "", mountainName: "" });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleExperienceSubmit = async () => {
    if (
      !experienceForm.title ||
      !experienceForm.description ||
      !experienceForm.mountainName ||
      !user
    )
      return;

    setUploadingExperience(true);
    try {
      const imageUrls: string[] = [];

      if (isFirebaseConfigured && storage && db) {
        // Upload images to Firebase Storage
        for (const file of experienceForm.images) {
          const storageRef = ref(
            storage,
            `experience-images/${user.uid}/${Date.now()}_${file.name}`
          );
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }

        // Save experience submission to Firestore
        await addDoc(collection(db, "experienceSubmissions"), {
          title: experienceForm.title,
          description: experienceForm.description,
          mountainName: experienceForm.mountainName,
          rating: experienceForm.rating,
          images: imageUrls,
          status: "pending",
          userEmail: user.email,
          userName: user.displayName || "Anonymous",
          submittedAt: serverTimestamp(),
        });

        // Reload experience submissions
        const experiencesQuery = query(
          collection(db, "experienceSubmissions"),
          where("userEmail", "==", user.email)
        );
        const experiencesSnap = await getDocs(experiencesQuery);
        const experiencesList: ExperienceSubmission[] =
          experiencesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        setExperienceSubmissions(experiencesList);
      } else {
        // Demo mode
        const demoExperience: ExperienceSubmission = {
          id: `demo_exp_${Date.now()}`,
          title: experienceForm.title,
          description: experienceForm.description,
          mountainName: experienceForm.mountainName,
          rating: experienceForm.rating,
          images: experienceForm.images.map((file) =>
            URL.createObjectURL(file)
          ),
          status: "pending",
          submittedAt: new Date(),
          userName: user.displayName || "Demo User",
          userEmail: user.email || "demo@example.com",
        };
        setExperienceSubmissions((prev) => [demoExperience, ...prev]);
      }

      // Reset form
      setExperienceForm({
        title: "",
        description: "",
        mountainName: "",
        rating: 5,
        images: [],
      });
    } catch (error) {
      console.error("Error submitting experience:", error);
      alert("Failed to submit experience. Please try again.");
    } finally {
      setUploadingExperience(false);
    }
  };

  const handleExperienceImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setExperienceForm({
      ...experienceForm,
      images: [...experienceForm.images, ...files],
    });
  };

  const removeExperienceImage = (index: number) => {
    const newImages = experienceForm.images.filter((_, i) => i !== index);
    setExperienceForm({ ...experienceForm, images: newImages });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }
  const hasBookings = bookings.length > 0;
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {capitalizeName(user?.name) || "Explorer"}
          </h1>
          <p className="text-gray-600">
            Manage your expeditions, share your journey, and track your
            progress.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bookings Section */}
              {hasBookings ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Bookings
                  </h2>
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-teal-100">
                            <Mountain className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {booking.bookingId}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />{" "}
                              {booking.slotDetails?.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-3 md:mt-0">
                          <div className="text-sm text-gray-700 flex items-center">
                            <User className="h-4 w-4 mr-1" />{" "}
                            {booking.participants}
                          </div>
                          <div className="text-sm text-gray-700 flex items-center">
                            {formatCurrency(booking.amount, booking.currency)}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <Link href={`/booking/confirmation/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                        {capitalizeName(user?.name) || "Not set"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-6">
                    You don't have any bookings yet. Start your adventure by
                    exploring our expeditions.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Share Your Experience
                </h2>
                <p className="text-gray-600 mb-6">
                  Share your expedition experience with the community. Your
                  submission will be reviewed by our team before being published
                  in the gallery.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Experience title"
                      value={experienceForm.title}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          title: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Mountain name"
                      value={experienceForm.mountainName}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          mountainName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Textarea
                    placeholder="Describe your experience in detail..."
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Rating:
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setExperienceForm({
                              ...experienceForm,
                              rating: star,
                            })
                          }
                          className={`${
                            star <= experienceForm.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExperienceImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />

                    {experienceForm.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {experienceForm.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeExperienceImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleExperienceSubmit}
                    disabled={
                      uploadingExperience ||
                      !experienceForm.title ||
                      !experienceForm.description ||
                      !experienceForm.mountainName
                    }
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {uploadingExperience ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Experience...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Experience
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {experienceSubmissions.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Experience Submissions
                  </h2>
                  <div className="space-y-4">
                    {experienceSubmissions.map((experience) => (
                      <div
                        key={experience.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {experience.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {experience.mountainName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                experience.status
                              )}`}
                            >
                              {experience.status === "pending" && (
                                <Clock className="h-3 w-3 mr-1 inline" />
                              )}
                              {experience.status === "approved" && (
                                <CheckCircle className="h-3 w-3 mr-1 inline" />
                              )}
                              {experience.status}
                            </span>
                            <div className="flex items-center">
                              {[...Array(experience.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">
                          {experience.description}
                        </p>
                        {experience.images.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {experience.images
                              .slice(0, 6)
                              .map((image, index) => (
                                <img
                                  key={index}
                                  src={image || "/placeholder.svg"}
                                  alt={`Experience ${index + 1}`}
                                  className="w-full h-16 object-cover rounded"
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Journey Images Section */}
              {/* <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Journey Images
                </h2>

                <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload your expedition photos
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            setImageForm({
                              ...imageForm,
                              file: e.target.files?.[0] || null,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {imageForm.file && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">
                          {imageForm.file.name}
                        </span>
                        <button
                          onClick={() =>
                            setImageForm({ ...imageForm, file: null })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Mountain name"
                          value={imageForm.mountainName}
                          onChange={(e) =>
                            setImageForm({
                              ...imageForm,
                              mountainName: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Caption or description"
                          value={imageForm.caption}
                          onChange={(e) =>
                            setImageForm({
                              ...imageForm,
                              caption: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Button
                        onClick={handleImageUpload}
                        disabled={
                          uploadingImage ||
                          !imageForm.caption ||
                          !imageForm.mountainName
                        }
                        className="w-full bg-teal-600 hover:bg-teal-700"
                      >
                        {uploadingImage ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {journeyImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {journeyImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-lg shadow-md"
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.caption}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm font-medium">
                            {image.mountainName}
                          </p>
                          <p className="text-xs text-gray-200">
                            {image.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No journey images uploaded yet.</p>
                    <p className="text-sm">
                      Share your expedition memories with the community!
                    </p>
                  </div>
                )}
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {!hasBookings && (
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to climb?
                    </h3>
                    <p className="text-gray-600">
                      Discover world-class expeditions tailored to your
                      experience level.
                    </p>
                  </div>
                  <Link href="/mountains" className="mt-6">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Explore Mountains
                    </Button>
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Journey Images</span>
                    <span className="font-medium">{journeyImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Experience Submissions
                    </span>
                    <span className="font-medium">
                      {experienceSubmissions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {user?.metadata?.creationTime
                        ? new Date(user?.metadata.creationTime).getFullYear()
                        : new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {!isFirebaseConfigured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Demo Mode:</strong> Firebase not configured. Images
                    and data will not persist.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
