
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
import { MessageSquare, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NoticeData {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  createdAt: string; // Added this property to fix type errors
  target?: string;
  commentsCount: number;
  likesCount: number;
}

interface NoticeCardProps {
  notice: NoticeData;
  className?: string;
}

export function NoticeCard({ notice, className }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(notice.likesCount);

  const toggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Truncate content if it's too long
  const truncatedContent = notice.content.length > 150 && !isExpanded
    ? notice.content.substring(0, 150) + "..."
    : notice.content;

  return (
    <Card className={cn("hover-scale overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={notice.author.avatar || "/placeholder.svg"} alt={notice.author.name} />
              <AvatarFallback>{notice.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{notice.title}</CardTitle>
              <CardDescription className="text-xs">
                {notice.author.name} • {notice.date}
              </CardDescription>
            </div>
          </div>
          {notice.target && (
            <Badge variant="outline" className="text-xs">
              {notice.target}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm">
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
        <Button variant="ghost" size="sm" className="text-xs">
          View Discussion
        </Button>
      </CardFooter>
    </Card>
  );
}
