
import { 
  Bell, 
  Bookmark, 
  Calendar, 
  Clock,
  MessageSquare, 
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function DashboardSummary() {
  // Mock data
  const summaryData = {
    newNotices: 3,
    upcomingServices: 1,
    savedProperties: 2,
    recentActivity: [
      { type: "notice", title: "Community Meeting", time: "2 hours ago" },
      { type: "property", title: "New apartment listing", time: "Yesterday" },
      { type: "service", title: "Plumber request completed", time: "3 days ago" },
    ],
    upcomingEvents: [
      { title: "Plumber Visit", date: "Jun 15, 2:00 PM", type: "service" },
      { title: "Building Maintenance", date: "Jun 18, 9:00 AM", type: "notice" },
    ],
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "notice":
        return <Bell className="h-4 w-4" />;
      case "property":
        return <Building className="h-4 w-4" />;
      case "service":
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "notice":
        return "default";
      case "property":
        return "outline";
      case "service":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summaryData.newNotices}</div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Link 
                to="/notices" 
                className="text-xs text-primary hover:underline"
              >
                View all notices
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summaryData.upcomingServices}</div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Link 
                to="/services" 
                className="text-xs text-primary hover:underline"
              >
                View all services
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summaryData.savedProperties}</div>
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Link 
                to="/properties" 
                className="text-xs text-primary hover:underline"
              >
                View all properties
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    {getIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <p className="font-medium">{activity.title}</p>
                      <Badge 
                        variant={getBadgeVariant(activity.type) as any} 
                        className="ml-2 text-[10px]"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <p className="font-medium">{event.title}</p>
                      <Badge 
                        variant={getBadgeVariant(event.type) as any} 
                        className="ml-2 text-[10px]"
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
