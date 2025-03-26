
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Wrench, Bell } from "lucide-react";

export function AdminOverview() {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Properties",
      value: 24,
      icon: Building,
      change: "+4 this month",
      link: "/admin/properties"
    },
    {
      title: "Active Tenants",
      value: 145,
      icon: Users,
      change: "+12 this month",
      link: "/admin/tenants"
    },
    {
      title: "Service Requests",
      value: 18,
      icon: Wrench,
      change: "5 pending",
      link: "/admin/services"
    },
    {
      title: "Active Notices",
      value: 7,
      icon: Bell,
      change: "2 expiring soon",
      link: "/admin/notices"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            <a 
              href={stat.link} 
              className="text-xs text-primary hover:underline block mt-2"
            >
              View details
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
