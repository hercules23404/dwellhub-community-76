
import { useState, useEffect } from "react";
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
import { Plus, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function NoticeList({ className }: { className?: string }) {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotices();
    
    // Set up realtime subscription for notices
    const channel = supabase
      .channel('public:notices')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notices' 
      }, (payload) => {
        console.log('Notices change received!', payload);
        fetchNotices();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match NoticeData format
      const transformedData = data.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: {
          name: notice.author_name,
          avatar: notice.author_avatar || "/placeholder.svg",
        },
        date: formatDate(notice.created_at),
        createdAt: notice.created_at,
        target: notice.target as any,
        category: notice.category as any,
        commentsCount: notice.comments_count,
        likesCount: notice.likes_count,
      }));
      
      setNotices(transformedData);
    } catch (error: any) {
      console.error('Error fetching notices:', error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        return 'Just now';
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleCreateNotice = async () => {
    if (!user) {
      toast.error("Please sign in to create a notice");
      return;
    }

    // In a real implementation, this would open a form modal
    toast.info("Create Notice feature coming soon", {
      description: "This feature will be available in the next update."
    });
  };

  const sortByDate = (a: NoticeData, b: NoticeData): number => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const filteredNotices = notices.filter(notice => {
    const matchesTarget = selectedTarget === "all" || notice.target === selectedTarget;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTarget && matchesSearch;
  }).sort((a, b) => {
    return sortByDate(a, b);
  });

  const targetGroups = Array.from(new Set(notices.map(notice => notice.target)));

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Community Notices</h2>
        <Button className="shrink-0" onClick={handleCreateNotice}>
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
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading notices...</p>
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              onReadToggle={(id, read) => {
                setNotices(prev => 
                  prev.map(n => n.id === id ? {...n, read} : n)
                );
              }}
            />
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
