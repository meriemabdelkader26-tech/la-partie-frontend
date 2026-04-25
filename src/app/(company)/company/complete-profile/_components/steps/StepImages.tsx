"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { Card } from "@/components/ui/card";
import { X, Upload, Star, Eye, EyeOff } from "lucide-react";
import { ProfileCompanyFormData } from "../types";
import { ImagesLogosSchema, ImagesLogosType } from "../schema";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

export default function StepImages(props: Props) {
  const { formData, onUpdate, onNext } = props;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ImagesLogosType>({
    resolver: zodResolver(ImagesLogosSchema),
    defaultValues: {
      images:
        formData.imagesLogos && formData.imagesLogos.length > 0
          ? formData.imagesLogos
          : [],
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

  const onSubmit = (data: ImagesLogosType) => {
    onUpdate({
      images: data.images,
    } as unknown as Partial<ProfileCompanyFormData>);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 animate-fadeIn">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Upload Company Media
          </h3>
          <p className="text-gray-500 font-medium">
            Upload your company logos and profile images. Set one as your default brand avatar.
          </p>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ErrorTriangle message={error} />
          </div>
        )}
        {form.formState.errors.images && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ErrorTriangle
              message={form.formState.errors.images.message || "Invalid images"}
            />
          </div>
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
            className="w-full border-4 border-dashed border-gray-100 rounded-[32px] p-12 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed shadow-inner-soft"
          >
            <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-gray-900 font-black text-lg mb-1">
              {uploading ? "Uploading..." : "Click to upload media"}
            </p>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
              PNG, JPG up to 5MB (Max 10 images)
            </p>
          </button>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden group rounded-[24px] border-2 transition-all duration-300 shadow-soft hover:shadow-medium ${
                  image.isDefault
                    ? "border-emerald-500 ring-4 ring-emerald-500/10 scale-105"
                    : "border-black/5 hover:border-emerald-200"
                }`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetDefault(index)}
                      className={`p-2.5 rounded-xl transition-all duration-300 transform active:scale-90 ${
                        image.isDefault
                          ? "bg-emerald-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-emerald-500 hover:text-white"
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
                      className="p-2.5 rounded-xl bg-white text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300 transform active:scale-90"
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
                      className="p-2.5 rounded-xl bg-white text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-300 transform active:scale-90"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Default Badge */}
                  {image.isDefault && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/20">
                      <Star className="size-3 fill-white" />
                      Default
                    </div>
                  )}

                  {/* Public/Private Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10 ${
                      image.isPublic
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-white"
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
          <div className="bg-gray-50 rounded-2xl p-6 border border-black/5 shadow-inner-soft flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeInUp">
            <div className="space-y-1">
              <p className="text-gray-900 font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Uploaded: {images.length} / 10 images
              </p>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-4">
                The default image will be your main company logo
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
              images.find((img) => img.isDefault) 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}>
              {images.find((img) => img.isDefault) ? "✓ Avatar Set" : "✗ Avatar Required"}
            </div>
          </div>
        )}

        <div className="pt-4 animate-fadeInUp delay-200">
          <SubmitButton 
            isLoading={uploading || form.formState.isSubmitting}
            className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continue to Review
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
