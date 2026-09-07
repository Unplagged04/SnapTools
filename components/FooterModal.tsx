"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Cpu,
  Lock,
  EyeOff,
  Trash2,
  FileCheck2,
  AlertTriangle,
  Scale
} from "lucide-react";

type ModalType = "privacy" | "terms" | "feedback" | null;

export default function FooterModal() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    if (activeModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "b1ae952b-4ea3-46b6-bd82-ecb261f039b3",
          subject: "New SnapTools Feedback Received",
          from_name: "SnapTools User",
          message: feedbackText,
          replyto: userEmail.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to submit message");
      }

      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackSent(false);
        setFeedbackText("");
        setUserEmail("");
        setActiveModal(null);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="w-full border-t border-slate-800/80 bg-[#08090D] py-6 mt-16 select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SnapTools. 100% Client-Side, Zero Tracking & In-Browser Processing.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-cyan-400 transition-colors font-medium cursor-pointer"
            >
              Privacy Notice
            </button>
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-cyan-400 transition-colors font-medium cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              onClick={() => setActiveModal("feedback")}
              className="hover:text-cyan-400 transition-colors font-medium cursor-pointer"
            >
              Feedback
            </button>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)} />

          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0b0e14] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-[#0d1117]">
              <div className="flex items-center gap-2.5">
                {activeModal === "privacy" && (
                  <>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Privacy Policy & Data Protection</h3>
                      <p className="text-xs text-slate-400">Zero-Server Client Execution & Complete Data Isolation</p>
                    </div>
                  </>
                )}

                {activeModal === "terms" && (
                  <>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Terms of Service & Usage Guidelines</h3>
                      <p className="text-xs text-slate-400">Legal Agreement, Conditions & Architecture Rules</p>
                    </div>
                  </>
                )}

                {activeModal === "feedback" && (
                  <>
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Send Feedback & Feature Request</h3>
                      <p className="text-xs text-slate-400">Directly reaches our development inbox</p>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* PRIVACY MODAL */}
              {activeModal === "privacy" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed">
                    🔒 <strong>Strict In-Browser Computing Guarantee:</strong> SnapTools is deliberately built with an offline-first, client-only architecture. When you process PDF files, images, passwords, or code snippets, your raw files and data are executed entirely on your local machine using modern browser engines.
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <Cpu className="w-4 h-4 text-emerald-400" /> 1. Zero Cloud Uploads
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Unlike traditional web converters, SnapTools does not transmit your documents or media to any cloud servers, remote Amazon S3 buckets, or backend processing clusters. File operations (PDF compression, PDF merging, background removal, steganography, hashing, and encryption) run inside your browser through WebAssembly (WASM), HTML5 Canvas, and Web Workers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <Trash2 className="w-4 h-4 text-emerald-400" /> 2. Volatile Memory & Auto-Purging
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Files exist only in your browser’s volatile RAM while you are interacting with them. As soon as you complete the operation, download the result, or close the browser tab, the allocated memory buffer is immediately reclaimed by the browser’s Garbage Collector. Nothing persists on disk or remote caches.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <EyeOff className="w-4 h-4 text-emerald-400" /> 3. No Tracking, Pixels, or Profiling
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      We respect digital sovereignty. We do not inject invasive user-tracking scripts, marketing pixels, device fingerprinting, or behavioral analytics. We do not build advertiser profiles or log your IP address.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-emerald-400" /> 4. Feedback & User Communications
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      If you submit feedback through our built-in contact form, only the contents of your message and any optional reply email address you explicitly supply are securely forwarded to our developer inbox via Web3Forms. This data is solely used to troubleshoot issues and respond to your inquiry.
                    </p>
                  </div>
                </div>
              )}

              {/* TERMS OF SERVICE MODAL */}
              {activeModal === "terms" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                    ⚖️ <strong>Agreement to Terms:</strong> By accessing and utilizing SnapTools, you acknowledge that all tool operations occur locally on your client machine and agree to abide by these Terms of Service.
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <FileCheck2 className="w-4 h-4 text-cyan-400" /> 1. License & Permitted Usage
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      SnapTools is provided free of charge for individual, commercial, and educational applications. You are welcome to optimize assets, sanitize metadata, edit PDFs, and generate design artifacts without licensing fees, subscriptions, or file quantity quotas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <Scale className="w-4 h-4 text-cyan-400" /> 2. Acceptable Conduct & User Responsibility
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Since processing occurs directly within your local environment, you maintain sole ownership, custody, and legal responsibility for any material loaded into SnapTools. You agree not to use the platform to process, compress, or manipulate copyrighted assets without permission, or handle materials that violate applicable regional or international laws.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-cyan-400" /> 3. Disclaimer of Warranties ("As-Is")
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      SnapTools is delivered on an "AS-IS" and "AS-AVAILABLE" basis without representations or warranties of any kind. While our tools are rigorously engineered to deliver high precision and data safety, we cannot be held liable for local system crashes, unexpected memory limits on large files, or unintended data loss. Users are encouraged to retain original copies of crucial documents.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                      <Cpu className="w-4 h-4 text-cyan-400" /> 4. Service Modifications
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      We reserve the right to refine algorithms, introduce additional utility modules, or adjust platform architecture at our discretion to further bolster user security and performance.
                    </p>
                  </div>
                </div>
              )}

              {/* FEEDBACK MODAL */}
              {activeModal === "feedback" && (
                <div>
                  {feedbackSent ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      <h4 className="text-base font-bold text-white">Feedback Sent Successfully!</h4>
                      <p className="text-xs text-slate-400">Thank you! Your message has been safely delivered to our developer inbox.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      {errorMessage && (
                        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Your Email Address (Optional, if you want a reply)
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="e.g. user@example.com"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Message or Tool Suggestion <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Write your feedback, bug report, or tool suggestions..."
                          className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-500/10 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending message...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Submit Feedback
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}