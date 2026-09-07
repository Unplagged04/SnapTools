"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  IndianRupee, 
  Calendar, 
  Percent,
  PieChart
} from "lucide-react";

export default function FinanceVisualizerPage() {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const calculations = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    if (principal <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, principalRatio: 100, interestRatio: 0 };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;

    const principalRatio = Math.round((principal / totalPayment) * 100);
    const interestRatio = 100 - principalRatio;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalRatio,
      interestRatio
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Calculations
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Everyday Utility
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Loan EMI & Interest Calculator
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Calculate your monthly installment, payable interest breakdown, and repayment schedule in real time.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Input Sliders */}
        <div className="md:col-span-7 space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-yellow-400" /> Loan Amount
              </span>
              <span className="text-white font-mono font-bold">₹ {formatCurrency(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-yellow-400" /> Interest Rate (p.a.)
              </span>
              <span className="text-white font-mono font-bold">{interestRate} %</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-yellow-400" /> Loan Tenure
              </span>
              <span className="text-white font-mono font-bold">{tenureYears} Years ({tenureYears * 12} Mos)</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className="md:col-span-5 space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center space-y-1">
            <span className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider">Monthly EMI</span>
            <div className="text-3xl font-black text-white font-mono">
              ₹ {formatCurrency(calculations.emi)}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Principal Amount</span>
              <span className="text-slate-200 font-bold font-mono">₹ {formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Total Interest</span>
              <span className="text-yellow-400 font-bold font-mono">₹ {formatCurrency(calculations.totalInterest)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Total Amount Payable</span>
              <span className="text-white font-bold font-mono">₹ {formatCurrency(calculations.totalPayment)}</span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden flex">
              <div 
                style={{ width: `${calculations.principalRatio}%` }} 
                className="bg-yellow-400 h-full transition-all duration-300"
                title={`Principal: ${calculations.principalRatio}%`}
              />
              <div 
                style={{ width: `${calculations.interestRatio}%` }} 
                className="bg-amber-600 h-full transition-all duration-300"
                title={`Interest: ${calculations.interestRatio}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" /> Principal ({calculations.principalRatio}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-600" /> Interest ({calculations.interestRatio}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
