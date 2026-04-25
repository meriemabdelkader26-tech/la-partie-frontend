"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step8ImagesSchema, Step8ImagesType } from "../schema";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { ProfileFormData } from "../types";
import { Card } from "@/components/ui/card";
import { X, Upload, Star, Eye, EyeOff } from "lucide-react";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepImages({ formData, onUpdate, onNext }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Step8ImagesType>({
    resolver: zodResolver(Step8ImagesSchema),
    defaultValues: {
      images: formData.images || [],
    },
  });

  const images = form.watch("images") || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      setError("You can upload up to 10 images only");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Max size is 5MB`);
        }

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
        );
        formData.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return {
          url: data.secure_url,
          isDefault: images.length === 0, // First image is default
          isPublic: true,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      form.setValue("images", newImages);
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the default image, make the first remaining image default
    if (images[index].isDefault && newImages.length > 0) {
      newImages[0].isDefault = true;
    }
    form.setValue("images", newImages);
  };

  const handleSetDefault = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isDefault: i === index,
    }));
    form.setValue("images", newImages);
  };

  const handleTogglePublic = (index: number) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, isPublic: !img.isPublic } : img
    );
    form.setValue("images", newImages);
  };

  const onSubmit = (data: Step8ImagesType) => {
    onUpdate({ images: data.images });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h2 className="text-2xl font-bold text-black mb-2">
            Upload Your Images
          </h2>
          <p className="text-gray-600">
            Upload profile images. Set one as your default avatar.
          </p>
        </div>

        {error && <ErrorTriangle message={error} />}
        {form.formState.errors.images && (
          <ErrorTriangle
            message={form.formState.errors.images.message || "Invalid images"}
          />
        )}

        {/* Upload Button */}
        <div className="space-y-4 animate-fadeInUp delay-100">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= 10}
            className="w-full border-2 border-dashed border-black/20 rounded-3xl p-12 text-center hover:border-black hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-black group-hover:scale-110 transition-all duration-300" />
            <p className="text-black font-bold text-lg mb-2">
              {uploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-gray-500 text-sm">
              PNG, JPG up to 5MB (Max 10 images)
            </p>
          </button>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fadeInUp delay-200">
            {images.map((image, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden bg-white border-2 rounded-2xl transition-all duration-300 hover:shadow-large ${
                  image.isDefault
                    ? "border-black ring-4 ring-black/20"
                    : "border-black/10 hover:border-black/30"
                }`}
              >
                <div className="aspect-square relative group">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSetDefault(index)}
                      className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                        image.isDefault
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-black hover:text-white"
                      }`}
                      title="Set as default avatar"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          image.isDefault ? "fill-white" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePublic(index)}
                      className="p-3 rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                      title={image.isPublic ? "Make private" : "Make public"}
                    >
                      {image.isPublic ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Default Badge */}
                  {image.isDefault && (
                    <div className="absolute top-3 left-3 bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-large">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      Default
                    </div>
                  )}

                  {/* Public/Private Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold shadow-large ${
                      image.isPublic
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {image.isPublic ? "Public" : "Private"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-2xl p-6 space-y-3 shadow-soft animate-fadeInUp delay-300">
            <p className="text-black text-sm font-semibold">
              <span className="text-gray-600">Uploaded:</span> {images.length} / 10 images
            </p>
            <p className="text-black text-sm font-semibold">
              <span className="text-gray-600">Default Avatar:</span>{" "}
              {images.find((img) => img.isDefault) ? "✓ Set" : "Not set"}
            </p>
            <p className="text-gray-500 text-xs">
              The default image will be used as your profile avatar.
            </p>
          </div>
        )}

        <div className="animate-fadeInUp delay-400">
          <SubmitButton isLoading={uploading || form.formState.isSubmitting}>
            Continue to Review
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
