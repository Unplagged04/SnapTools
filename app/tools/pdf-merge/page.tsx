"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { 
  ArrowLeft, 
  UploadCloud, 
  Trash2, 
  Download, 
  FileText, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  ArrowUpDown
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

export default function PDFMergerPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: UploadedFile[] = Array.from(e.target.files)
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: formatBytes(f.size),
      }));

    setFiles((prev) => [...prev, ...newFiles]);
    setMergedBlobUrl(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlobUrl(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const updated = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
    setMergedBlobUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (error) {
      console.error("PDF Merge Error:", error);
      alert("Failed to merge PDFs. Please make sure the files are not password-protected.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Execution
        </div>
      </div>

      {/* Tool Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Zero-Server Utility
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Zero-Server PDF Merger
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Combine multi-page PDF documents locally inside your browser memory. Your files are never uploaded to any cloud server.
        </p>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#0d1117] rounded-3xl p-8 text-center relative transition-all group">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click or drag & drop PDFs here</p>
            <p className="text-xs text-slate-500 mt-1">Select 2 or more PDF files to combine</p>
          </div>
        </div>
      </div>

      {/* Uploaded Files Queue */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Documents to merge ({files.length})</span>
            <span>Use arrows to reorder</span>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0e14] border border-slate-800/80"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500">{file.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, "up")}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge & Download Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={mergePDFs}
              disabled={files.length < 2 || isMerging}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10"
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Merging locally...
                </>
              ) : (
                `Merge ${files.length} PDFs`
              )}
            </button>

            {mergedBlobUrl && (
              <a
                href={mergedBlobUrl}
                download="merged-document.pdf"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 animate-bounce"
              >
                <Download className="w-4 h-4" /> Download Merged PDF
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
