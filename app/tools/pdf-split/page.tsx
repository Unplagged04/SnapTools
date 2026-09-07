"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  FileMinus, 
  FileText, 
  RotateCcw,
  CheckCircle2,
  Loader2,
  CheckSquare,
  Square
} from "lucide-react";

export default function PDFSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    if (selected.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = pdfDoc.getPageCount();

      setFile(selected);
      setPageCount(total);
      // Select all pages by default
      setSelectedPages(Array.from({ length: total }, (_, i) => i));
      setSplitBlobUrl(null);
    } catch (err) {
      console.error(err);
      alert("Could not read PDF. It may be encrypted or corrupted.");
    }
  };

  const togglePage = (index: number) => {
    setSplitBlobUrl(null);
    setSelectedPages((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i));
    setSplitBlobUrl(null);
  };

  const clearSelection = () => {
    setSelectedPages([]);
    setSplitBlobUrl(null);
  };

  const extractPages = async () => {
    if (!file || selectedPages.length === 0) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(sourcePdf, selectedPages);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(newBytes)], { type: "application/pdf" });
      setSplitBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("PDF Split Error:", err);
      alert("Failed to extract pages from this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setSplitBlobUrl(null);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Extraction
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> PDF Management Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PDF Splitter & Page Remover
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Extract specific pages or remove unwanted sheets from your document locally in seconds.
        </p>
      </div>

      {/* Upload Area */}
      {!file ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Click or drag & drop a PDF document</p>
              <p className="text-xs text-slate-500 mt-1">Multi-page files supported</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {/* File Overview */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)} • {pageCount} pages</p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Choose Another
            </button>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Select Pages to Keep ({selectedPages.length} of {pageCount} selected)
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Page Grid Selector */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 border border-slate-800/80 rounded-2xl bg-slate-950/60">
            {Array.from({ length: pageCount }, (_, idx) => {
              const isSelected = selectedPages.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => togglePage(idx)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500 text-cyan-300"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                  <span>Page {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Action Area */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={extractPages}
              disabled={isProcessing || selectedPages.length === 0}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting Selected Pages...
                </>
              ) : (
                <>
                  <FileMinus className="w-4 h-4" /> Save {selectedPages.length} Selected Page(s)
                </>
              )}
            </button>

            {splitBlobUrl && (
              <a
                href={splitBlobUrl}
                download={`extracted_${file.name}`}
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Result PDF
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}