import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Flame, Phone, Droplets, Tv, AlertCircle, Lightbulb } from "lucide-react";

const utilities = [
  { id: 1, name: "SaskPower", type: "Electricity", amount: 150, dueDate: "2025-05-01", status: "Due", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: 2, name: "SaskEnergy", type: "Natural Gas", amount: 200, dueDate: "2025-05-15", status: "Due", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 3, name: "SaskTel", type: "Internet & Phone", amount: 80, dueDate: "2025-05-10", status: "Paid", icon: Phone, color: "text-brand-blue", bg: "bg-blue-50" },
  { id: 4, name: "Regina Water", type: "Water", amount: 45, dueDate: "2025-05-05", status: "Due", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50" },
  { id: 5, name: "Saskatoon Water", type: "Water", amount: 50, dueDate: "2025-05-07", status: "Due", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50" },
  { id: 6, name: "TransGas", type: "Gas Transmission", amount: 120, dueDate: "2025-05-12", status: "Due", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 7, name: "Access Communications", type: "Internet & TV", amount: 90, dueDate: "2025-05-08", status: "Paid", icon: Tv, color: "text-purple-500", bg: "bg-purple-50" },
  { id: 8, name: "Saskatoon Light & Power", type: "Electricity", amount: 130, dueDate: "2025-05-03", status: "Due", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
];

const tips = [
  "Turn off lights when not in use to save electricity.",
  "Use a programmable thermostat to reduce gas usage.",
  "Fix leaks promptly to conserve water.",
  "Switch to energy-efficient appliances for long-term savings.",
];

const totalDue = utilities.filter(u => u.status === "Due").reduce((sum, u) => sum + u.amount, 0);

export default function UtilitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Utilities Hub</h1>
        <p className="text-gray-500">All your Saskatchewan essential services in one place</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Total Outstanding</p>
            <p className="text-2xl font-bold text-red-600">${totalDue}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-brand-green">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Bills Paid</p>
            <p className="text-2xl font-bold text-brand-green">{utilities.filter(u => u.status === "Paid").length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-brand-amber">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Next Due</p>
            <p className="text-2xl font-bold text-brand-amber">2025-05-01</p>
          </CardContent>
        </Card>
      </div>

      {/* Utility Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
        {utilities.map((u) => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${u.bg}`}>
                  <u.icon className={`h-5 w-5 ${u.color}`} />
                </div>
                <Badge variant={u.status === "Paid" ? "secondary" : "destructive"} className="text-xs">{u.status}</Badge>
              </div>
              <CardTitle className="text-base mt-2">{u.name}</CardTitle>
              <p className="text-xs text-gray-500">{u.type}</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-gray-900">${u.amount}</p>
              <p className="text-xs text-gray-400">Due: {u.dueDate}</p>
              <div className="flex gap-2 mt-3">
                {u.status === "Due" && <Button size="sm" className="flex-1 text-xs">Pay Now</Button>}
                <Button size="sm" variant="outline" className="flex-1 text-xs"><AlertCircle className="mr-1 h-3 w-3" /> Report</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conservation Tips */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-brand-amber" /> Conservation Tips</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-lg bg-amber-50 border border-amber-100 p-4">
              <p className="text-sm text-amber-800">💡 {tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
