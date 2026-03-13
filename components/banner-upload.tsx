"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { useApiClient } from "@/hooks/use-api-client";

interface BannerUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
}

export function BannerUpload({ onUpload, defaultValue }: BannerUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiClient = useApiClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Get signature from backend
      const { data: signData } = await apiClient.get("/api/upload/signature");

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);
      if (signData.uploadPreset) {
        formData.append("upload_preset", signData.uploadPreset);
      }

      const cloudUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
      const { data: uploadResult } = await axios.post(cloudUrl, formData);

      const uploadedUrl = uploadResult.secure_url;
      setPreview(uploadedUrl);
      onUpload(uploadedUrl);
    } catch (err: any) {
      console.error("Upload failed", err);
      const serverError = err.response?.data?.error?.message;
      setError(serverError ? `Cloudinary: ${serverError}` : "Failed to upload image. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function removeImage() {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="text-[0.8rem] font-bold tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
        Hackathon Banner <span className="text-claude-tan">*</span>
      </label>

      {preview ? (
        <div className="relative group aspect-[21/9] rounded-xl overflow-hidden border-2 border-sand shadow-inner animate-in fade-in duration-500">
          <img src={preview} alt="Banner preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button
              type="button"
              onClick={removeImage}
              className="bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all transform hover:scale-110 active:scale-95 blur-0"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            aspect-[21/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer
            transition-all duration-300 group
            ${loading ? "opacity-50 pointer-events-none" : "hover:border-claude-tan hover:bg-claude-tan/5"}
          `}
          style={{ borderColor: "var(--sand)", background: "var(--warm-white)" }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-claude-tan" />
              <p className="text-[0.8rem] font-medium text-earth">Uploading image...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-lg bg-sand/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-claude-tan/10 transition-all">
                <Upload size={24} className="text-earth group-hover:text-claude-tan" />
              </div>
              <p className="text-[0.85rem] font-semibold text-ink">Click to upload banner</p>
              <p className="text-[0.7rem] text-earth mt-1">Recommended: 1200x512px (PNG, JPG)</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[0.75rem] text-red-500 font-medium animate-in slide-in-from-top-1 px-1">
          {error}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
