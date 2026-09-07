"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Video, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Cpu, 
  Lock, 
  Download,
  ArrowUpRight,
  Eye,
  Scissors,
  QrCode,
  Image as ImageIcon,
  Calculator,
  Database,
  Smartphone,
  Palette,
  FileDown,
  Layers,
  FileMinus,
  KeyRound,
  FileCheck,
  Minimize2,
  HardDrive,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All", 
    "PDF Tools",
    "Creator Tools", 
    "Smart AI", 
    "Privacy & Lock", 
    "Photo & Design", 
    "Daily Utility"
  ];

  const tools = [
    // --- PDF Tools ---
    {
      id: "pdf-compress",
      title: "PDF Compressor",
      desc: "Reduce heavy PDF file size quickly without losing text or image quality.",
      category: "PDF Tools",
      icon: Minimize2,
      tag: "Most Popular",
      path: "/tools/pdf-compress",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "pdf-merge",
      title: "PDF Merger",
      desc: "Combine multiple PDF files into a single document in seconds.",
      category: "PDF Tools",
      icon: Layers,
      tag: "Essential",
      path: "/tools/pdf-merge",
      badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30"
    },
    {
      id: "pdf-split",
      title: "PDF Splitter & Page Remover",
      desc: "Separate pages or delete unwanted pages from your PDF file.",
      category: "PDF Tools",
      icon: FileMinus,
      tag: "Fast",
      path: "/tools/pdf-split",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    {
      id: "pdf-protect",
      title: "Lock PDF with Password",
      desc: "Add strong password protection to confidential files and bank statements.",
      category: "PDF Tools",
      icon: KeyRound,
      tag: "Secure",
      path: "/tools/pdf-protect",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    {
      id: "pdf-watermark",
      title: "PDF Watermark & Signature",
      desc: "Add custom stamps, watermarks, or your signature onto PDF pages.",
      category: "PDF Tools",
      icon: FileCheck,
      tag: "Office",
      path: "/tools/pdf-watermark",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      id: "img-to-pdf",
      title: "Image to PDF Converter",
      desc: "Turn your JPG, PNG, and camera photos into a neat PDF document.",
      category: "PDF Tools",
      icon: FileDown,
      tag: "Daily Tool",
      path: "/tools/img-to-pdf",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30"
    },

    // --- Creator Tools ---
    {
      id: "yt-safe-crop",
      title: "YouTube Thumbnail Tester",
      desc: "Preview thumbnail crop on Mobile, Desktop, and TV to make sure titles aren't hidden.",
      category: "Creator Tools",
      icon: Video,
      tag: "For Creators",
      path: "/tools/yt-safe-crop",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    {
      id: "thumbnail-ab",
      title: "Thumbnail Comparison (A/B)",
      desc: "Put two thumbnails side-by-side to test which one catches eyes better.",
      category: "Creator Tools",
      icon: Eye,
      tag: "CTR Booster",
      path: "/tools/thumbnail-ab",
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    },
    {
      id: "reading-pacer",
      title: "Video Script Speed Calculator",
      desc: "Know exactly how many minutes your script will take with a live teleprompter speed test.",
      category: "Creator Tools",
      icon: FileText,
      tag: "Scripting",
      path: "/tools/speech-pacer",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
      id: "social-downloader",
      title: "Social Media Asset & Video Downloader",
      desc: "Extract HD thumbnails, covers, and direct video download links for YouTube, Instagram, and Facebook.",
      category: "Creator Tools",
      icon: Download,
      tag: "Multi-Platform",
      path: "/tools/social-downloader",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30"
    },

    // --- Smart AI ---
    {
      id: "prompt-optimizer",
      title: "AI Prompt Shortener & Cleaner",
      desc: "Remove extra fluff from prompts to get faster, sharper answers from ChatGPT and Gemini.",
      category: "Smart AI",
      icon: Cpu,
      tag: "Smart AI",
      path: "/tools/prompt-optimizer",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    {
      id: "sql-visualizer",
      title: "SQL Query Visualizer",
      desc: "Turn database tables and queries into clean visual flowcharts instantly.",
      category: "Smart AI",
      icon: Database,
      tag: "Developer",
      path: "/tools/sql-visualizer",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      id: "viewport-matrix",
      title: "Screen Size Tester",
      desc: "Check how your website looks across Mobile, Tablet, and Desktop screens together.",
      category: "Smart AI",
      icon: Smartphone,
      tag: "Responsive",
      path: "/tools/viewport-matrix",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30"
    },

    // --- Privacy & Lock ---
    {
      id: "metadata-stripper",
      title: "Photo Privacy Cleaner",
      desc: "Remove hidden location, camera details, and device IDs from photos before posting.",
      category: "Privacy & Lock",
      icon: ShieldCheck,
      tag: "100% Private",
      path: "/tools/metadata-stripper",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "secure-shredder",
      title: "Permanent File Shredder",
      desc: "Overwrite files in local memory so they cannot be recovered by any recovery software.",
      category: "Privacy & Lock",
      icon: Lock,
      tag: "Security",
      path: "/tools/binary-shredder",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    {
      id: "steganography-vault",
      title: "Hide Secret Message in Photo",
      desc: "Conceal secret notes or copyright text invisibly inside regular image pixels.",
      category: "Privacy & Lock",
      icon: Zap,
      tag: "Unique",
      path: "/tools/steganography",
      badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30"
    },

    // --- Photo & Design ---
    {
      id: "bg-remover",
      title: "Instant Background Remover",
      desc: "Erase background from portraits and products with 1-click right in your browser.",
      category: "Photo & Design",
      icon: Scissors,
      tag: "Fast AI",
      path: "/tools/bg-remover",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30"
    },
    {
      id: "color-contrast-oled",
      title: "Screen Contrast & Battery Saver",
      desc: "Check text readability and see how much OLED phone battery your dark mode saves.",
      category: "Photo & Design",
      icon: Palette,
      tag: "Design",
      path: "/tools/color-contrast",
      badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30"
    },
    {
      id: "image-optimizer",
      title: "Image Size Reducer (WebP)",
      desc: "Shrink heavy photos into lightweight WebP format to save space and load faster.",
      category: "Photo & Design",
      icon: ImageIcon,
      tag: "Compression",
      path: "/tools/image-optimizer",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    },
    {
      id: "svg-converter",
      title: "SVG to High-Res PNG Converter",
      desc: "Convert vector SVG logos and graphics to crisp 2K, 4K, or 8K transparent PNGs.",
      category: "Photo & Design",
      icon: Sparkles,
      tag: "Vector Tool",
      path: "/tools/svg-converter",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },

    // --- Daily Utility ---
    {
      id: "branded-qr",
      title: "Custom QR Code Maker",
      desc: "Create stylish QR codes with custom colors and your logo right in the center.",
      category: "Daily Utility",
      icon: QrCode,
      tag: "High Demand",
      path: "/tools/qr-architect",
      badgeColor: "bg-lime-500/20 text-lime-400 border-lime-500/30"
    },
    {
      id: "sip-emi-visualizer",
      title: "Loan EMI & Savings Calculator",
      desc: "Plan your monthly loan payments or investment returns with clear visual charts.",
      category: "Daily Utility",
      icon: Calculator,
      tag: "Finance",
      path: "/tools/finance-visualizer",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCat = activeCategory === "All" || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen px-4 py-10 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-black font-black">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">SnapTools</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Superfast online tools that run directly on your device.</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          100% Private • No Files Uploaded to Cloud
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900/90 to-[#0c1017] border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> All-in-One Everyday Tools
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Do more in seconds, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            without sharing your private files.
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Compress PDFs, check YouTube thumbnails, remove photo backgrounds, and more directly on your phone or PC.
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            placeholder="Search any tool (e.g. Compress PDF, QR, Crop)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="group bg-[#0d1117] hover:bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{tool.category}</span>
                <span className="text-cyan-400 font-bold group-hover:underline">Open Tool →</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- Privacy Policy Section --- */}
      <section className="mt-16 pt-12 border-t border-slate-800/80 space-y-8">
        <div className="bg-[#0b0e14] border border-slate-800/90 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">100% Privacy Guarantee</h3>
                <p className="text-xs text-slate-400">Your documents stay on your computer or phone</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-auto">
              Privacy First Platform
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/50 border border-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <HardDrive className="w-4 h-4" /> No Server Upload
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your PDF files, photos, and texts are processed directly inside your browser. We never send your files to any remote server or third-party database.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/50 border border-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                <Lock className="w-4 h-4" /> Discarded on Tab Close
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                As soon as you finish your work or close this browser tab, all temporary memory is deleted immediately. Nothing is saved anywhere.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/50 border border-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
                <CheckCircle2 className="w-4 h-4" /> Free for Everyone
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                No sign-up, no subscriptions, and no hidden file-size limits. Fast, clean, and completely free forever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
