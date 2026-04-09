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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Upload Your Images
          </h3>
          <p className="text-slate-400 text-sm">
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
        <div className="space-y-4">
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
            className="w-full border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium mb-1">
              {uploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-slate-500 text-sm">
              PNG, JPG up to 5MB (Max 10 images)
            </p>
          </button>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden bg-slate-700 border-2 ${
                  image.isDefault
                    ? "border-emerald-500 ring-2 ring-emerald-500/50"
                    : "border-slate-600"
                }`}
              >
                <div className="aspect-square relative group">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetDefault(index)}
                      className={`p-2 rounded-full ${
                        image.isDefault
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-600 text-slate-200 hover:bg-emerald-600"
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
                      className="p-2 rounded-full bg-slate-600 text-slate-200 hover:bg-blue-600"
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
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Default Badge */}
                  {image.isDefault && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Default
                    </div>
                  )}

                  {/* Public/Private Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      image.isPublic
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-slate-300"
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
          <div className="bg-slate-700 rounded-lg p-4 space-y-2">
            <p className="text-slate-300 text-sm">
              <span className="font-medium">Uploaded:</span> {images.length} /
              10 images
            </p>
            <p className="text-slate-300 text-sm">
              <span className="font-medium">Default Avatar:</span>{" "}
              {images.find((img) => img.isDefault) ? "Set" : "Not set"}
            </p>
            <p className="text-slate-400 text-xs">
              The default image will be used as your profile avatar.
            </p>
          </div>
        )}

        <SubmitButton isLoading={uploading || form.formState.isSubmitting}>
          Continue to Review
        </SubmitButton>
      </form>
    </Form>
  );
}
