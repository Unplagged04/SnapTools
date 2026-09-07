"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { 
  ArrowLeft, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Trash2, 
  ArrowUpDown, 
  Loader2,
  FileDown
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    
    const newItems: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name
    }));

    setImages((prev) => [...prev, ...newItems]);
    setPdfBlobUrl(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfBlobUrl(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const updated = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
    setPdfBlobUrl(null);
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const imageBytes = await item.file.arrayBuffer();
        let pdfImage;

        if (item.file.type === "image/jpeg" || item.file.type === "image/jpg") {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (item.file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Fallback via canvas for WebP and other formats
          const img = new Image();
          img.src = item.previewUrl;
          await new Promise((res) => { img.onload = res; });
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
          if (!pngBlob) continue;
          const pngBytes = await pngBlob.arrayBuffer();
          pdfImage = await pdfDoc.embedPng(pngBytes);
        }

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to create PDF. Please check your image files.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Conversion
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Fast Document Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Image to PDF Converter
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Turn your JPG, PNG, and camera photos into a neat multi-page PDF document without uploading to any server.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-[#0d1117] rounded-3xl p-8 text-center relative transition-all group">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click or drag & drop photos here</p>
            <p className="text-xs text-slate-500 mt-1">Select one or multiple images</p>
          </div>
        </div>
      </div>

      {/* Image Previews & Ordering */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Selected Images ({images.length})</span>
            <span>Reorder or remove</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group bg-[#0b0e14] border border-slate-800 p-2 rounded-2xl flex flex-col gap-2">
                <div className="aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="truncate max-w-[80px]">{img.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, "up")}
                      className="p-1 hover:text-white disabled:opacity-20"
                      title="Move left/up"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 hover:text-red-400 text-slate-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={convertToPDF}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
                </>
              ) : (
                `Convert ${images.length} Images to PDF`
              )}
            </button>

            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                download="images-combined.pdf"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 animate-bounce"
              >
                <Download className="w-4 h-4" /> Download PDF File
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}