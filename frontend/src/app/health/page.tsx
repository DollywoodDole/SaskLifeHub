"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Brain, Pill, Phone, Users, Calendar, ClipboardList, Lightbulb } from "lucide-react";

const services = [
  { icon: Calendar, title: "Doctor Appointments", desc: "Book appointments with local doctors", color: "text-brand-blue", bg: "bg-blue-50", badge: null },
  { icon: ClipboardList, title: "Health Record Tracker", desc: "Access and manage your health records", color: "text-green-500", bg: "bg-green-50", badge: null },
  { icon: Activity, title: "Wellness Tracker", desc: "Track steps, water intake, and sleep", color: "text-teal-500", bg: "bg-teal-50", badge: null },
  { icon: Brain, title: "Mental Health Support", desc: "Resources and virtual counseling", color: "text-purple-500", bg: "bg-purple-50", badge: null },
  { icon: Pill, title: "Prescription Manager", desc: "Track and refill prescriptions", color: "text-orange-500", bg: "bg-orange-50", badge: null },
  { icon: Phone, title: "Emergency Services", desc: "Quick access to emergency contacts", color: "text-red-500", bg: "bg-red-50", badge: "911" },
  { icon: Users, title: "Community Wellness", desc: "Share and discover health tips", color: "text-pink-500", bg: "bg-pink-50", badge: null },
  { icon: Calendar, title: "Health Events Board", desc: "Explore local health events", color: "text-indigo-500", bg: "bg-indigo-50", badge: null },
];

const events = ["SaskLife Vaccination Clinic — May 5, 2025", "SaskLife Wellness Workshop — May 12, 2025"];
const resources = [
  { title: "Vaccination Reminder", desc: "Get your flu shot this month!", category: "Health Events" },
  { title: "Mental Health Tip", desc: "Practice mindfulness daily", category: "Mental Health Support" },
  { title: "Hydration Goal", desc: "Drink 8 glasses of water today", category: "Wellness Tracker" },
  { title: "Emergency Contact", desc: "Saskatoon City Hospital", category: "Emergency Services" },
];

export default function HealthPage() {
  const [steps, setSteps] = useState("5000");
  const [water, setWater] = useState("6");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Agora</h1>
        <p className="text-gray-500">Your local hub for health and medical services in Saskatchewan</p>
      </div>

      {/* Wellness Dashboard */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-teal-400">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Daily Steps</p>
            <Input type="number" value={steps} onChange={e => setSteps(e.target.value)} className="text-2xl font-bold h-auto p-0 border-0 focus-visible:ring-0 text-teal-600 mt-1" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-400">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Water Intake (glasses)</p>
            <Input type="number" value={water} onChange={e => setWater(e.target.value)} className="text-2xl font-bold h-auto p-0 border-0 focus-visible:ring-0 text-cyan-600 mt-1" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-brand-blue">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">Next Appointment</p>
            <p className="text-2xl font-bold text-brand-blue mt-1">May 3, 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Health Services</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {services.map((s) => (
          <Card key={s.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                {s.badge && <Badge variant="destructive">{s.badge}</Badge>}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue">{s.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full text-xs">Use Service</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Resources */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Resources</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {resources.map((r, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{r.title}</CardTitle>
              <CardDescription>{r.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
              <Button size="sm" variant="outline" className="w-full text-xs">Learn More</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Heart className="h-5 w-5 text-red-500" /> Health Events</h2>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="rounded-lg bg-red-50 border border-red-100 p-4">
            <p className="text-sm text-red-800">📅 {e}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
