
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NoticeData } from "./NoticeCard";

export function useNotices() {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select('*');
      
      if (error) throw error;
      
      // Transform Supabase data to match NoticeData format
      const transformedData: NoticeData[] = data.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: {
          name: notice.author_name,
          avatar: notice.author_avatar || "/placeholder.svg",
        },
        date: formatDate(notice.created_at),
        createdAt: notice.created_at,
        target: notice.target,
        category: notice.category,
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

  return {
    notices,
    loading,
    setNotices
  };
}
