
import { useState } from "react";
import { NoticeCard, NoticeData } from "./NoticeCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockNotices: NoticeData[] = [
  {
    id: "1",
    title: "Community Meeting This Weekend",
    content: "We will be having our monthly community meeting this Saturday at 10 AM in the common area. Topics to be discussed include the upcoming renovation projects and the annual budget review. All residents are encouraged to attend and participate.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
    },
    date: "2 hours ago",
    target: "All Residents",
    commentsCount: 5,
    likesCount: 12,
  },
  {
    id: "2",
    title: "Pool Maintenance Notice",
    content: "The community pool will be closed for maintenance from June 15th to June 18th. We apologize for any inconvenience this may cause. The maintenance is necessary to ensure the pool remains safe and clean for all residents.",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg",
    },
    date: "Yesterday",
    target: "Pool Users",
    commentsCount: 8,
    likesCount: 7,
  },
  {
    id: "3",
    title: "New Fitness Classes Available",
    content: "We're excited to announce new fitness classes in our community gym! Starting next week, we will offer yoga on Tuesdays at 6 PM and HIIT workouts on Thursdays at 7 PM. These classes are free for all residents. Please bring your own mat for yoga classes.",
    author: {
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg",
    },
    date: "2 days ago",
    target: "Fitness Enthusiasts",
    commentsCount: 12,
    likesCount: 24,
  },
  {
    id: "4",
    title: "Parking Regulations Reminder",
    content: "A friendly reminder about our community parking regulations. Please ensure that all vehicles are parked in designated spots. Visitor parking is limited to 24 hours. Any vehicles parked in fire lanes or blocking access will be towed at the owner's expense.",
    author: {
      name: "David Wilson",
      avatar: "/placeholder.svg",
    },
    date: "3 days ago",
    target: "All Residents",
    commentsCount: 3,
    likesCount: 5,
  },
];

interface NoticeListProps {
  className?: string;
}

export function NoticeList({ className }: NoticeListProps) {
  const [notices, setNotices] = useState<NoticeData[]>(mockNotices);
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");

  const filteredNotices = notices.filter(notice => {
    // Filter by target group
    const matchesTarget = selectedTarget === "all" || notice.target === selectedTarget;
    
    // Filter by search query
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTarget && matchesSearch;
  }).sort((a, b) => {
    // Sort based on the selected option
    switch (sortOption) {
      case "oldest":
        // Assuming newer items have "ago" dates, we sort in reverse
        return a.id < b.id ? -1 : 1;
      case "most-interacted":
        // Sum of comments and likes
        const interactionA = a.commentsCount + a.likesCount;
        const interactionB = b.commentsCount + b.likesCount;
        return interactionB - interactionA;
      case "newest":
      default:
        // Default sorting by newest (assuming higher IDs are newer)
        return a.id > b.id ? -1 : 1;
    }
  });

  // Get unique target groups
  const targetGroups = ["All Residents", "Pool Users", "Fitness Enthusiasts"];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Community Notices</h2>
        <Button className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-8"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className={cn(
            "items-center gap-2",
            showFilters ? "flex flex-col sm:flex-row" : "hidden sm:flex"
          )}>
            <Select 
              value={selectedTarget} 
              onValueChange={setSelectedTarget}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All targets</SelectItem>
                {targetGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={sortOption} 
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-interacted">Most Interacted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No notices found</p>
        </div>
      )}
    </div>
  );
}
