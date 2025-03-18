
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
  // Enhanced mock data with timestamps for proper sorting
  const summaryData = {
    newNotices: 5,
    upcomingServices: 3,
    savedProperties: 4,
    recentActivity: [
      { 
        type: "notice", 
        title: "Emergency Water Shutdown", 
        time: "Just now",
        timestamp: "2023-06-10T16:00:00Z" 
      },
      { 
        type: "notice", 
        title: "Community Garden Project", 
        time: "1 hour ago",
        timestamp: "2023-06-10T15:45:00Z" 
      },
      { 
        type: "notice", 
        title: "Community Meeting", 
        time: "2 hours ago",
        timestamp: "2023-06-10T14:30:00Z" 
      },
      { 
        type: "property", 
        title: "New loft listing in Arts District", 
        time: "Today",
        timestamp: "2023-06-10T10:15:00Z" 
      },
      { 
        type: "service", 
        title: "Plumber request completed", 
        time: "Yesterday",
        timestamp: "2023-06-09T13:20:00Z" 
      },
    ],
    upcomingEvents: [
      { 
        title: "Plumber Visit", 
        date: "Tomorrow, 2:00 PM", 
        type: "service",
        timestamp: "2023-06-11T14:00:00Z" 
      },
      { 
        title: "Community Meeting", 
        date: "Jun 12, 10:00 AM", 
        type: "notice",
        timestamp: "2023-06-12T10:00:00Z" 
      },
      { 
        title: "Building Maintenance", 
        date: "Jun 15, 9:00 AM", 
        type: "service",
        timestamp: "2023-06-15T09:00:00Z" 
      },
    ],
  };

  // Sort activities by timestamp to show latest first
  const sortedActivities = [...summaryData.recentActivity].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Sort upcoming events by timestamp to show soonest first
  const sortedEvents = [...summaryData.upcomingEvents].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

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
              {sortedActivities.map((activity, i) => (
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
              {sortedEvents.map((event, i) => (
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
