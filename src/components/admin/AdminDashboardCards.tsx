
import { Card, CardContent } from "@/components/ui/card";
import { Users, Wrench, Home, Calendar } from "lucide-react";
import React from "react";

const stats = [
  {
    label: "Total Tenants",
    value: 12,
    icon: Users,
    bg: "bg-purple-100",
    iconColor: "text-violet-600",
    animate: "animate-fade-in"
  },
  {
    label: "Pending Service Requests",
    value: 4,
    icon: Wrench,
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    animate: "animate-fade-in"
  },
  {
    label: "Properties Available",
    value: 3,
    icon: Home,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    animate: "animate-fade-in"
  },
  {
    label: "Leases Expiring This Month",
    value: 2,
    icon: Calendar,
    bg: "bg-red-100",
    iconColor: "text-rose-600",
    animate: "animate-fade-in"
  },
];

export function AdminDashboardCards() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`hover:shadow-lg transition-all duration-200 scale-100 hover:scale-105 ${stat.animate}`}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-full p-3 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
