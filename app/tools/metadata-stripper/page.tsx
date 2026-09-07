"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  FileCheck, 
  MapPinOff, 
  CameraOff,
  RotateCcw
} from "lucide-react";

export default function MetadataStripperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setCleanedUrl(null);
  };

  const stripMetadata = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Draw onto an in-memory HTML5 canvas to strip all EXIF, GPS and metadata
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context initialization failed");

      ctx.drawImage(img, 0, 0);

      // Re-encode fresh bitmap without any EXIF tags
      canvas.toBlob((blob) => {
        if (blob) {
          const cleanBlobUrl = URL.createObjectURL(blob);
          setCleanedUrl(cleanBlobUrl);
        }
        setIsProcessing(false);
      }, "image/jpeg", 0.95);
    } catch (err) {
      console.error("Metadata Stripping Error:", err);
      alert("Failed to process image metadata.");
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setCleanedUrl(null);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Privacy
        </div>
      </div>

      {/* Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Privacy Guard
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Photo Privacy Cleaner
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Completely erase hidden GPS coordinates, camera models, shutter details, and device serial numbers before sharing online.
        </p>
      </div>

      {/* Upload Box */}
      {!file ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Click or drag & drop a photo here</p>
              <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, and WebP images</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Upload Another
            </button>
          </div>

          {/* Sanitizer Items Removed List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <MapPinOff className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">GPS Location Coordinates</p>
                <p className="text-[11px] text-slate-500">Strips exact latitude, longitude, and altitude</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <CameraOff className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Camera & Device Hardware</p>
                <p className="text-[11px] text-slate-500">Removes phone model, lens info, and timestamps</p>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          {!cleanedUrl ? (
            <button
              onClick={stripMetadata}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
            >
              {isProcessing ? "Sanitizing in Memory..." : "Clean Metadata & Secure Photo"}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300">Photo Sanitized Successfully!</p>
                  <p className="text-[11px] text-slate-400">All EXIF and location traces were wiped clean.</p>
                </div>
              </div>

              <a
                href={cleanedUrl}
                download={`sanitized_${file.name}`}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Clean Image
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}