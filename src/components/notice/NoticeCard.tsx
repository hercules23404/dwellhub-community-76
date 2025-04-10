
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Clock, Users, Calendar, Bell, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type NoticeCategory = 
  | "announcement" 
  | "maintenance" 
  | "lease" 
  | "payment" 
  | "community" 
  | "urgent"
  | string;

export type NoticeTarget = 
  | "all-tenants" 
  | "specific-tenant" 
  | "building-a" 
  | "building-b" 
  | "floor-1" 
  | "floor-2" 
  | "new-tenants" 
  | "management"
  | "All Residents"
  | "Pool Users"
  | "Fitness Enthusiasts"
  | "Garden Enthusiasts"
  | string;

export interface NoticeData {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  date: string;
  createdAt: string;
  target?: NoticeTarget;
  category?: NoticeCategory;
  priority?: "low" | "medium" | "high";
  expiresAt?: string;
  attachments?: Array<{name: string, url: string, type: string}>;
  commentsCount: number;
  likesCount: number;
  read?: boolean;
}

interface NoticeCardProps {
  notice: NoticeData;
  className?: string;
  onReadToggle?: (id: string, read: boolean) => void;
}

export function NoticeCard({ notice, className, onReadToggle }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(notice.likesCount);
  const [isRead, setIsRead] = useState(notice.read || false);
  const { user } = useAuth();

  const toggleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like notices");
      return;
    }

    try {
      if (isLiked) {
        // Unlike the notice
        await supabase
          .from('notice_likes')
          .delete()
          .match({ notice_id: notice.id, user_id: user.id });
        
        setLikesCount(prev => prev - 1);
      } else {
        // Like the notice
        await supabase
          .from('notice_likes')
          .insert({ notice_id: notice.id, user_id: user.id });
        
        setLikesCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
      
      // Update the likes count in the notices table
      await supabase
        .from('notices')
        .update({ likes_count: isLiked ? likesCount - 1 : likesCount + 1 })
        .eq('id', notice.id);
        
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to process your like");
    }
  };

  const toggleRead = () => {
    const newReadState = !isRead;
    setIsRead(newReadState);
    if (onReadToggle) {
      onReadToggle(notice.id, newReadState);
    }
  };

  // Format dates for display
  const formattedDate = notice.date;
  
  // Check if notice is urgent or expired
  const isUrgent = notice.priority === "high" || notice.category === "urgent";
  const isExpired = notice.expiresAt ? isBefore(parseISO(notice.expiresAt), new Date()) : false;
  const expiresReason = isExpired ? "Expired" : notice.expiresAt ? `Expires ${format(parseISO(notice.expiresAt), 'MMM d')}` : "";

  // Truncate content if it's too long
  const truncatedContent = notice.content.length > 150 && !isExpanded
    ? notice.content.substring(0, 150) + "..."
    : notice.content;

  // Category icon mapping
  const getCategoryIcon = () => {
    switch(notice.category) {
      case "maintenance": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "lease": return <Calendar className="h-4 w-4 text-purple-500" />;
      case "payment": return <Clock className="h-4 w-4 text-green-500" />;
      case "community": return <Users className="h-4 w-4 text-blue-500" />;
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  useEffect(() => {
    // Check if the current user has liked this notice
    if (user) {
      const checkLikeStatus = async () => {
        try {
          const { data } = await supabase
            .from('notice_likes')
            .select('id')
            .match({ notice_id: notice.id, user_id: user.id })
            .single();
          
          setIsLiked(!!data);
        } catch (error) {
          // If error is 'No rows found', it means user hasn't liked the notice
          console.log('Like status check:', error);
        }
      };
      
      checkLikeStatus();
    }
  }, [user, notice.id]);

  return (
    <Card className={cn(
      "hover-scale overflow-hidden transition-all duration-300", 
      !isRead && "border-l-4 border-l-primary",
      isUrgent && "border-l-4 border-l-red-500", 
      isExpired && "opacity-75",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={notice.author.avatar || "/placeholder.svg"} alt={notice.author.name} />
              <AvatarFallback>{notice.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{notice.title}</CardTitle>
                {notice.category && (
                  <div className="flex items-center">
                    {getCategoryIcon()}
                  </div>
                )}
              </div>
              <CardDescription className="text-xs flex items-center gap-1">
                <span>{notice.author.name}</span>
                {notice.author.role && (
                  <span className="text-xs text-muted-foreground">({notice.author.role})</span>
                )}
                <span>•</span>
                <span>{formattedDate}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {notice.target && (
              <Badge variant="outline" className="text-xs">
                {notice.target.replace(/-/g, ' ')}
              </Badge>
            )}
            {notice.priority && (
              <Badge 
                variant={
                  notice.priority === "high" ? "destructive" : 
                  notice.priority === "medium" ? "secondary" : "outline"
                }
                className="text-xs"
              >
                {notice.priority}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className={cn("text-sm", !isRead && "font-medium")}>
          {truncatedContent}
          {notice.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:underline focus:outline-none ml-1 text-xs font-medium"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
        
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {notice.attachments.map((attachment, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {attachment.name}
              </Badge>
            ))}
          </div>
        )}
        
        {expiresReason && (
          <p className="text-xs text-muted-foreground mt-2">
            {expiresReason}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <button 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
            onClick={toggleLike}
          >
            <Heart 
              className={cn(
                "h-4 w-4", 
                isLiked && "fill-primary text-primary"
              )} 
            />
            <span>{likesCount}</span>
          </button>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{notice.commentsCount}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={toggleRead}
          >
            {isRead ? "Mark as unread" : "Mark as read"}
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            View Discussion
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
