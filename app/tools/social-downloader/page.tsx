"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Link2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Video
} from "lucide-react";

interface MediaResult {
  platform: "youtube" | "instagram" | "facebook" | "unknown";
  id?: string;
  thumbnailUrl?: string;
  directWatchUrl: string;
  cobaltDownloadUrl: string;
}

export default function SocialDownloaderPage() {
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractMediaInfo = (url: string) => {
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) return;

    // 1. YouTube Matcher
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const vidId = ytMatch[1];
      setResult({
        platform: "youtube",
        id: vidId,
        thumbnailUrl: `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`,
        directWatchUrl: `https://www.youtube.com/watch?v=${vidId}`,
        cobaltDownloadUrl: `https://cobalt.tools/#${encodeURIComponent(trimmed)}`
      });
      return;
    }

    // 2. Instagram Matcher
    if (trimmed.includes("instagram.com")) {
      setResult({
        platform: "instagram",
        directWatchUrl: trimmed,
        cobaltDownloadUrl: `https://cobalt.tools/#${encodeURIComponent(trimmed)}`
      });
      return;
    }

    // 3. Facebook Matcher
    if (trimmed.includes("facebook.com") || trimmed.includes("fb.watch")) {
      setResult({
        platform: "facebook",
        directWatchUrl: trimmed,
        cobaltDownloadUrl: `https://cobalt.tools/#${encodeURIComponent(trimmed)}`
      });
      return;
    }

    setError("Please enter a valid YouTube, Instagram, or Facebook link.");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    extractMediaInfo(urlInput);
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
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Parsing
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Social Media Grabber
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Social Video & Asset Downloader
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Extract Ultra-HD thumbnails, covers, and direct video download gateways for YouTube Videos/Shorts, Instagram Reels, and Facebook clips.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl space-y-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste YouTube, Instagram Reel, or Facebook video URL..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-500/10 shrink-0"
          >
            Fetch Assets
          </button>
        </form>

        {/* Supported Badges with Custom SVGs */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </span>

          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-pink-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram Reels
          </span>

          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook Watch
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {result.platform} Asset Detected
              </span>
            </div>
            <a
              href={result.directWatchUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
            >
              Original Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* YouTube Thumbnail Preview */}
          {result.thumbnailUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-rose-400" /> Maximum Resolution Cover / Thumbnail
                </span>
                <a
                  href={result.thumbnailUrl}
                  download={`youtube-thumb-${result.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" /> Save HD Thumbnail
                </a>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 relative group">
                <img
                  src={result.thumbnailUrl}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Download Gateway */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-400" /> Complete Video & Audio Stream (.mp4)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Export video with zero server storage using open-source privacy proxy.
                </p>
              </div>

              <a
                href={result.cobaltDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-rose-500/10 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Video
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
