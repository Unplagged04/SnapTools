"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  RotateCcw,
  EyeOff,
  CheckCircle2
} from "lucide-react";

export default function SteganographyPage() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  
  // Encode States
  const [encodeImage, setEncodeImage] = useState<string | null>(null);
  const [secretText, setSecretText] = useState("");
  const [encodedBlobUrl, setEncodedBlobUrl] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);

  // Decode States
  const [decodeImage, setDecodeImage] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodeInputRef = useRef<HTMLInputElement>(null);
  const decodeInputRef = useRef<HTMLInputElement>(null);

  // Delimiter to know when the message ends in binary stream
  const END_MARKER = "###SNAPTOOLS_END###";

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "encode" | "decode"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    if (mode === "encode") {
      setEncodeImage(url);
      setEncodedBlobUrl(null);
    } else {
      setDecodeImage(url);
      setExtractedMessage(null);
    }
  };

  // ENCODE: Hide string inside red-channel least significant bits
  const hideSecretMessage = async () => {
    if (!encodeImage || !secretText.trim()) return;
    setIsEncoding(true);

    const img = new Image();
    img.src = encodeImage;
    await new Promise((res) => { img.onload = res; });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert string to binary with end marker
    const fullText = secretText + END_MARKER;
    let binaryStr = "";
    for (let i = 0; i < fullText.length; i++) {
      const bin = fullText.charCodeAt(i).toString(2).padStart(8, "0");
      binaryStr += bin;
    }

    if (binaryStr.length > data.length / 4) {
      alert("Text is too large to fit in this image resolution. Pick a larger photo.");
      setIsEncoding(false);
      return;
    }

    // Embed bits into LSB of Red and Blue channels
    for (let i = 0; i < binaryStr.length; i++) {
      const pixelIdx = i * 4;
      const bit = parseInt(binaryStr[i], 10);
      data[pixelIdx] = (data[pixelIdx] & ~1) | bit;
    }

    ctx.putImageData(imgData, 0, 0);

    // Steganography requires PNG (Lossless) - JPG destroys LSB bits
    canvas.toBlob((blob) => {
      if (blob) {
        setEncodedBlobUrl(URL.createObjectURL(blob));
      }
      setIsEncoding(false);
    }, "image/png");
  };

  // DECODE: Extract secret string from LSB bits
  const extractSecretMessage = async () => {
    if (!decodeImage) return;
    setIsDecoding(true);

    const img = new Image();
    img.src = decodeImage;
    await new Promise((res) => { img.onload = res; });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binaryStr = "";
    let decodedText = "";

    for (let i = 0; i < data.length; i += 4) {
      const bit = (data[i] & 1).toString();
      binaryStr += bit;

      if (binaryStr.length === 8) {
        const charCode = parseInt(binaryStr, 2);
        const char = String.fromCharCode(charCode);
        decodedText += char;
        binaryStr = "";

        if (decodedText.endsWith(END_MARKER)) {
          decodedText = decodedText.replace(END_MARKER, "");
          break;
        }
      }
    }

    if (decodedText && !decodedText.includes(END_MARKER)) {
      setExtractedMessage(decodedText);
    } else {
      setExtractedMessage("No hidden message found in this image, or format was modified.");
    }
    setIsDecoding(false);
  };

  const copyDecodedText = () => {
    if (!extractedMessage) return;
    navigator.clipboard.writeText(extractedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Memory Steganography
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Invisible Cryptography
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Hide Secret Message in Photo
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Conceal confidential text notes or ownership proof invisibly inside ordinary image pixels. Decode anytime without any third-party app.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#0b0e14] border border-slate-800 rounded-2xl w-fit mx-auto">
        <button
          onClick={() => setActiveTab("encode")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "encode"
              ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4" /> Hide Secret (Encode)
        </button>
        <button
          onClick={() => setActiveTab("decode")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "decode"
              ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Unlock className="w-4 h-4" /> Read Secret (Decode)
        </button>
      </div>

      {/* ENCODE WORKSPACE */}
      {activeTab === "encode" && (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {!encodeImage ? (
            <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 bg-[#0d1117] rounded-2xl p-8 text-center relative group cursor-pointer">
              <input
                ref={encodeInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleImageUpload(e, "encode")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-teal-400 mx-auto group-hover:scale-110 transition-transform mb-2" />
              <p className="text-xs font-bold text-white">Upload carrier image (PNG recommended)</p>
              <p className="text-[10px] text-slate-500 mt-1">Photo will look identical before and after embedding</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs text-slate-400 font-semibold">Carrier Image Loaded</span>
                <button
                  onClick={() => { setEncodeImage(null); setEncodedBlobUrl(null); }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Change Photo
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-teal-400" /> Secret Text to Hide
                </label>
                <textarea
                  rows={4}
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Type passwords, copyright notes, or confidential text..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={hideSecretMessage}
                disabled={!secretText.trim() || isEncoding}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/10"
              >
                {isEncoding ? "Injecting into Pixels..." : "Inject Secret & Create PNG"}
              </button>

              {encodedBlobUrl && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-300">Message Encoded Losslessly!</p>
                      <p className="text-[11px] text-slate-400">Save as PNG to keep hidden bits intact.</p>
                    </div>
                  </div>

                  <a
                    href={encodedBlobUrl}
                    download="stego-vault-image.png"
                    className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Protected PNG
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DECODE WORKSPACE */}
      {activeTab === "decode" && (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {!decodeImage ? (
            <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 bg-[#0d1117] rounded-2xl p-8 text-center relative group cursor-pointer">
              <input
                ref={decodeInputRef}
                type="file"
                accept="image/png"
                onChange={(e) => handleImageUpload(e, "decode")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-teal-400 mx-auto group-hover:scale-110 transition-transform mb-2" />
              <p className="text-xs font-bold text-white">Upload encoded PNG image</p>
              <p className="text-[10px] text-slate-500 mt-1">Select the photo containing hidden message</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs text-slate-400 font-semibold">Image Ready for Scan</span>
                <button
                  onClick={() => { setDecodeImage(null); setExtractedMessage(null); }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Upload Another
                </button>
              </div>

              <button
                onClick={extractSecretMessage}
                disabled={isDecoding}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/10"
              >
                {isDecoding ? "Reading Pixel Bits..." : "Extract Hidden Message"}
              </button>

              {extractedMessage && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300">Extracted Result:</span>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-teal-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {extractedMessage}
                  </div>

                  <button
                    onClick={copyDecodedText}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Secret Message"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
