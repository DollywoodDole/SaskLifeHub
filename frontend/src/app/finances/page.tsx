"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp, Calculator, Target, Users, Briefcase, PieChart, Lightbulb } from "lucide-react";

const tools = [
  { icon: Calculator, title: "Budget Tracker", desc: "Set and track your monthly budget", color: "text-brand-blue", bg: "bg-blue-50" },
  { icon: PieChart, title: "Expense Analyzer", desc: "Categorize and analyze spending", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: DollarSign, title: "Tax Calculator", desc: "Estimate your Saskatchewan provincial taxes", color: "text-green-500", bg: "bg-green-50" },
  { icon: TrendingUp, title: "Investment Tracker", desc: "Monitor your investments and portfolio", color: "text-brand-blue", bg: "bg-blue-50" },
  { icon: Calculator, title: "Loan Calculator", desc: "Calculate loan payments and interest", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Target, title: "Savings Goal Planner", desc: "Set and track financial goals", color: "text-teal-500", bg: "bg-teal-50" },
  { icon: Users, title: "Peer-to-Peer Advice", desc: "Share and discover financial tips", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Briefcase, title: "Opportunities Board", desc: "Explore local financial opportunities", color: "text-indigo-500", bg: "bg-indigo-50" },
];

const tips = [
  "💸 Create an emergency fund with 3–6 months of expenses.",
  "💸 Diversify your investments to reduce risk.",
  "💸 Automate savings to reach your goals faster.",
  "💸 Review your budget weekly to stay on track.",
];

const community = [
  { title: "Seeking Advice on RRSPs", user: "User123", category: "Peer-to-Peer Advice" },
  { title: "Local Investment Group", user: "User456", category: "Opportunities Board" },
];

export default function FinancesPage() {
  const [budget, setBudget] = useState(2000);
  const [expenses, setExpenses] = useState(1350);
  const remaining = budget - expenses;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Agora</h1>
        <p className="text-gray-500">Your local hub for financial tools and community</p>
      </div>

      {/* Budget Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-brand-blue">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Monthly Budget</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 text-sm">$</span>
              <Input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="text-2xl font-bold h-auto p-0 border-0 focus-visible:ring-0 text-brand-blue" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Expenses</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 text-sm">$</span>
              <Input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className="text-2xl font-bold h-auto p-0 border-0 focus-visible:ring-0 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={`border-l-4 ${remaining >= 0 ? "border-l-brand-green" : "border-l-red-500"}`}>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? "text-brand-green" : "text-red-600"}`}>${remaining.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {tools.map((t) => (
          <Card key={t.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-6">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${t.bg}`}>
                <t.icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue">{t.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{t.desc}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full text-xs">Use Tool</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Community Marketplace</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {community.map((c, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
              <CardDescription>Posted by {c.user} · {c.category}</CardDescription>
            </CardHeader>
            <CardContent><Button size="sm" variant="outline">View Listing</Button></CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-brand-amber" /> Financial Tips</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip, i) => (
          <div key={i} className="rounded-lg bg-green-50 border border-green-100 p-4">
            <p className="text-sm text-green-800">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
