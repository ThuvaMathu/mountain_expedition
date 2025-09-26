"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Upload,
  X,
  Check,
  MapPin,
  User,
  MessageSquare,
  Mountain,
  Mail,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ImageUploader } from "../global/image-uploader";
import { processImages } from "@/lib/image-processor";

interface FormData {
  name: string;
  location: string;
  mountain: string;
  rating: number;
  text: string;
  email: string;
  image?: File;
}

interface FormErrors {
  name?: string;
  location?: string;
  rating?: string;
  text?: string;
  email?: string;
  image?: string;
}

interface Mountain {
  id: string;
  name: string;
  location: string;
}

export default function ReviewSubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    mountain: "",
    rating: 0,
    text: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingMountains, setLoadingMountains] = useState(true);

  // Mock mountains data for when Firebase is not configured
  const mockMountains: Mountain[] = [
    { id: "1", name: "Mount Kilimanjaro", location: "Tanzania" },
    { id: "2", name: "Everest Base Camp", location: "Nepal" },
    { id: "3", name: "Mount Aconcagua", location: "Argentina" },
    { id: "4", name: "Mont Blanc", location: "France/Italy/Switzerland" },
    { id: "5", name: "Annapurna Circuit", location: "Nepal" },
    { id: "6", name: "Mount Whitney", location: "California, USA" },
    { id: "7", name: "Mount Fuji", location: "Japan" },
    { id: "8", name: "Matterhorn", location: "Switzerland/Italy" },
  ];

  // Load mountains from database or use mock data
  const loadMountains = async () => {
    if (!isFirebaseConfigured || !db) {
      setMountains(mockMountains);
      setLoadingMountains(false);
      return;
    }

    try {
      const q = query(collection(db, "mountains"), orderBy("name"));
      const snapshot = await getDocs(q);
      const loadedMountains = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        location: doc.data().location,
      })) as Mountain[];

      if (loadedMountains.length === 0) {
        setMountains(mockMountains);
      } else {
        setMountains(loadedMountains);
      }
    } catch (error) {
      console.error("Error loading mountains:", error);
      setMountains(mockMountains);
    } finally {
      setLoadingMountains(false);
    }
  };

  useEffect(() => {
    loadMountains();
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const Tfile = e.target.files?.[0];

    if (!Tfile) return;
    const processedFile = await processImages(Tfile, {
      aspectRatio: "original",
      targetSizeKB: 120,
    });
    const file = processedFile[0];
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear image error
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.text.trim()) {
      newErrors.text = "Review text is required";
    } else if (formData.text.trim().length < 10) {
      newErrors.text = "Review must be at least 10 characters";
    } else if (formData.text.trim().length > 500) {
      newErrors.text = "Review must be less than 500 characters";
    }

    // Optional email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!isFirebaseConfigured || !storage) {
      return null;
    }

    try {
      const timestamp = Date.now();
      const fileName = `testimonials/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (formData.image) {
        try {
          imageUrl = (await uploadImage(formData.image)) || "";
        } catch (error) {
          setErrors({ image: "Failed to upload image. Please try again." });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare testimonial data
      const testimonialData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        mountain: formData.mountain || "",
        rating: formData.rating,
        text: formData.text.trim(),
        email: formData.email || "",
        image: imageUrl,
        status: "pending" as const,
        createdAt: isFirebaseConfigured ? serverTimestamp() : new Date(),
      };

      if (isFirebaseConfigured && db) {
        // Save to Firebase
        await addDoc(collection(db, "testimonials"), testimonialData);
      } else {
        // Mock submission for demo
        console.log("Mock testimonial submission:", testimonialData);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setErrors({ text: "Failed to submit review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br  py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Review!
            </h2>
            <p className="text-gray-600 mb-6">
              Your testimonial has been submitted successfully and is now under
              review. We appreciate you taking the time to share your experience
              with us.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong>
                <br />
                Our team will review your testimonial within 24-48 hours. Once
                approved, it will appear on our website to help other
                adventurers plan their journeys.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  location: "",
                  mountain: "",
                  rating: 0,
                  text: "",
                  email: "",
                });
                setImagePreview(null);
                setErrors({});
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-full font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
            >
              Submit Another Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Adventure
          </h1>
          <p className="text-xl text-gray-600">
            Help fellow adventurers by sharing your climbing experience
          </p>
          {!isFirebaseConfigured && (
            <div className="mt-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
              Demo mode: Your submission won't be saved permanently
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <User className="h-4 w-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.location
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="e.g., California, USA"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Mountain Selection */}
            <div>
              <label
                htmlFor="mountain"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <Mountain className="h-4 w-4 inline mr-2" />
                Mountain/Trek (Optional)
              </label>
              <select
                id="mountain"
                name="mountain"
                value={formData.mountain}
                onChange={handleInputChange}
                disabled={loadingMountains}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select a mountain/trek (optional)</option>
                {mountains.map((mountain) => (
                  <option key={mountain.id} value={mountain.name}>
                    {mountain.name} - {mountain.location}
                  </option>
                ))}
              </select>
              {loadingMountains && (
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Loading mountains...
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-2" />
                Rating *
              </label>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`p-1 rounded-full transition-all hover:scale-110 ${
                      star <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating ? "fill-current" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-sm text-gray-600">
                  {formData.rating} out of 5 stars
                </p>
              )}
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Your Review *
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.text ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Share your experience, what you loved most, and any tips for future climbers..."
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {errors.text && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.text}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {formData.text.length}/500 characters
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="your.email@example.com (for follow-up if needed)"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Camera className="h-4 w-4 inline mr-2" />
                Profile Photo (Optional)
              </label>

              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.image && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.image}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional: Upload a profile photo (max 5MB, JPG/PNG)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Submit Review
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Your review will be reviewed by our team before being published
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
