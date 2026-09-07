"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  Play, 
  RotateCcw, 
  ArrowDown, 
  Layers, 
  Filter, 
  ListOrdered, 
  Table2,
  Code2
} from "lucide-react";

interface QueryStep {
  stage: string;
  keyword: string;
  details: string;
  order: number;
}

export default function SQLVisualizerPage() {
  const [sql, setSql] = useState(
`SELECT u.id, u.name, COUNT(o.id) as total_orders
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.name
HAVING total_orders > 2
ORDER BY total_orders DESC
LIMIT 10;`
  );

  // Parse SQL into standardized logical order of query processing
  const executionPlan = useMemo(() => {
    if (!sql.trim()) return [];

    const steps: QueryStep[] = [];
    const text = sql.replace(/\n/g, " ");

    const extractMatch = (regex: RegExp) => {
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    };

    const fromMatch = extractMatch(/FROM\s+(.+?)(?=\s+(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|WHERE|GROUP BY|ORDER BY|LIMIT|;|$))/i);
    const joinMatches = [...text.matchAll(/(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)\s+(.+?)\s+ON\s+(.+?)(?=\s+(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|WHERE|GROUP BY|ORDER BY|LIMIT|;|$))/gi)];
    const whereMatch = extractMatch(/WHERE\s+(.+?)(?=\s+(GROUP BY|HAVING|ORDER BY|LIMIT|;|$))/i);
    const groupByMatch = extractMatch(/GROUP BY\s+(.+?)(?=\s+(HAVING|ORDER BY|LIMIT|;|$))/i);
    const havingMatch = extractMatch(/HAVING\s+(.+?)(?=\s+(ORDER BY|LIMIT|;|$))/i);
    const selectMatch = extractMatch(/SELECT\s+(.+?)\s+FROM/i);
    const orderByMatch = extractMatch(/ORDER BY\s+(.+?)(?=\s+(LIMIT|;|$))/i);
    const limitMatch = extractMatch(/LIMIT\s+(\d+)/i);

    // 1. FROM stage
    if (fromMatch) {
      steps.push({
        stage: "Base Table Scan",
        keyword: "FROM",
        details: `Scan source table: ${fromMatch}`,
        order: 1
      });
    }

    // 2. JOIN stage
    if (joinMatches.length > 0) {
      joinMatches.forEach((j) => {
        steps.push({
          stage: "Relational Join",
          keyword: j[1].toUpperCase(),
          details: `Join table ${j[2]} matching condition (${j[3]})`,
          order: 2
        });
      });
    }

    // 3. WHERE stage
    if (whereMatch) {
      steps.push({
        stage: "Row Filter",
        keyword: "WHERE",
        details: `Filter rows matching: ${whereMatch}`,
        order: 3
      });
    }

    // 4. GROUP BY stage
    if (groupByMatch) {
      steps.push({
        stage: "Data Aggregation",
        keyword: "GROUP BY",
        details: `Cluster rows into groups by: ${groupByMatch}`,
        order: 4
      });
    }

    // 5. HAVING stage
    if (havingMatch) {
      steps.push({
        stage: "Group Filtering",
        keyword: "HAVING",
        details: `Filter aggregate results where: ${havingMatch}`,
        order: 5
      });
    }

    // 6. SELECT stage
    if (selectMatch) {
      steps.push({
        stage: "Column Projection",
        keyword: "SELECT",
        details: `Compute columns and expressions: ${selectMatch}`,
        order: 6
      });
    }

    // 7. ORDER BY stage
    if (orderByMatch) {
      steps.push({
        stage: "Result Sorting",
        keyword: "ORDER BY",
        details: `Sort output dataset by: ${orderByMatch}`,
        order: 7
      });
    }

    // 8. LIMIT stage
    if (limitMatch) {
      steps.push({
        stage: "Row Slicing",
        keyword: "LIMIT",
        details: `Keep first ${limitMatch} records only`,
        order: 8
      });
    }

    return steps;
  }, [sql]);

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
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser SQL Parsing
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Database Architecture Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SQL Query Flow Visualizer
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Deconstruct complex SQL statements into a clear, logical step-by-step query execution lifecycle without sending your database schema anywhere.
        </p>
      </div>

      {/* Editor & Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Editor Column */}
        <div className="md:col-span-5 space-y-4 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-400" /> SQL Editor
            </span>
            <button
              onClick={() => setSql("")}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={14}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Paste your SQL SELECT query here..."
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-cyan-200 font-mono focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
          />

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Load Templates</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSql(
`SELECT p.title, p.price, c.category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.stock > 0
ORDER BY p.price DESC
LIMIT 5;`
                )}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                E-Commerce Filter
              </button>
              <button
                onClick={() => setSql(
`SELECT customer_id, AVG(amount) as avg_spend
FROM payments
WHERE payment_date >= '2026-01-01'
GROUP BY customer_id
HAVING avg_spend > 500
ORDER BY avg_spend DESC;`
                )}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                Financial Aggregate
              </button>
            </div>
          </div>
        </div>

        {/* Execution Flowchart Column */}
        <div className="md:col-span-7 space-y-4 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" /> Logical Query Engine Pipeline
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {executionPlan.length} lifecycle step(s)
            </span>
          </div>

          {executionPlan.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Enter a valid SQL SELECT statement to visualize execution stages.
            </div>
          ) : (
            <div className="space-y-3 relative">
              {executionPlan.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                      {idx + 1}
                    </div>

                    <div className="space-y-1 overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{step.stage}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {step.keyword}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono break-words leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>

                  {idx < executionPlan.length - 1 && (
                    <div className="my-1.5 text-slate-600">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
