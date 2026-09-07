"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap, 
  Cpu, 
  ArrowRight,
  TrendingDown
} from "lucide-react";

export default function PromptOptimizerPage() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState("Expert Assistant");
  const [outputFormat, setOutputFormat] = useState("Direct & Concise");

  // Approximate Token Calculation (1 token ~= 4 chars in English)
  const estimateTokens = (text: string) => {
    if (!text.trim()) return 0;
    return Math.ceil(text.trim().length / 4);
  };

  const inputTokens = estimateTokens(inputPrompt);
  const outputTokens = estimateTokens(optimizedPrompt);
  const tokensSaved = Math.max(0, inputTokens - outputTokens);
  const percentSaved = inputTokens > 0 ? Math.round((tokensSaved / inputTokens) * 100) : 0;

  const optimizePrompt = () => {
    if (!inputPrompt.trim()) return;

    let text = inputPrompt.trim();

    // 1. Remove polite conversational filler / fluff phrases
    const fluffPatterns = [
      /hello\s*([,!.]|$)/gi,
      /hi\s*(chatgpt|gemini|ai)?\s*([,!.]|$)/gi,
      /could you please\s*/gi,
      /please can you\s*/gi,
      /can you please\s*/gi,
      /i want you to\s*/gi,
      /i would like you to\s*/gi,
      /i would appreciate it if you could\s*/gi,
      /thank you very much\s*([,!.]|$)/gi,
      /thanks in advance\s*([,!.]|$)/gi,
      /in order to\s*/gi,
      /as much as possible\s*/gi,
      /tell me about\s*/gi,
      /give me an answer to\s*/gi,
    ];

    fluffPatterns.forEach((pattern) => {
      text = text.replace(pattern, " ");
    });

    // Clean multiple spaces and newlines
    text = text.replace(/\s+/g, " ").trim();

    // 2. Build High-Precision Structured System Prompt
    const structuredResult = `Role: ${role}
Task: ${text}
Format: ${outputFormat}. Zero conversational filler. Jump straight to the solution.`;

    setOptimizedPrompt(structuredResult);
  };

  const copyToClipboard = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setInputPrompt("");
    setOptimizedPrompt("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Memory Processing
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> AI Utility
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Prompt Shortener & Cleaner
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Strip fluff, cut token costs, and structure your prompts to get crisp, accurate responses from LLMs without latency.
        </p>
      </div>

      {/* Preset Config Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0b0e14] border border-slate-800">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Target Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="Expert Assistant">Expert Assistant (General)</option>
            <option value="Senior Software Engineer">Senior Software Engineer</option>
            <option value="Content Strategist & Copywriter">Content Strategist & Copywriter</option>
            <option value="Academic Researcher">Academic Researcher</option>
            <option value="Growth Marketer">Growth Marketer</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Response Style</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="Direct & Concise">Direct & Concise (Bullet points)</option>
            <option value="Step-by-Step Tutorial">Step-by-Step Tutorial</option>
            <option value="Production-Ready Code Only">Production-Ready Code Only</option>
            <option value="Executive Summary">Executive Summary</option>
          </select>
        </div>
      </div>

      {/* Prompt Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Raw Prompt Input
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ~{inputTokens} tokens
            </span>
          </div>

          <textarea
            rows={9}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type your long query here... (e.g. 'Hello ChatGPT, could you please kindly write a python script for...')"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
          />

          <div className="flex gap-2">
            <button
              onClick={optimizePrompt}
              disabled={!inputPrompt.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Zap className="w-4 h-4 fill-black" /> Optimize & Trim Fluff
            </button>
            <button
              onClick={resetAll}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Clean Prompt
            </span>
            <div className="flex items-center gap-2">
              {percentSaved > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> {percentSaved}% saved
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-500">
                ~{outputTokens} tokens
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={9}
              value={optimizedPrompt}
              placeholder="Your optimized, token-efficient prompt will appear here ready to paste..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-cyan-200 font-mono focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={copyToClipboard}
            disabled={!optimizedPrompt}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied to Clipboard!" : "Copy Clean Prompt"}
          </button>
        </div>
      </div>
    </main>
  );
}
