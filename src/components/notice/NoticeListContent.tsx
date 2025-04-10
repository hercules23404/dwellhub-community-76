
import React from "react";
import { NoticeCard, NoticeData } from "./NoticeCard";

interface NoticeListContentProps {
  loading: boolean;
  notices: NoticeData[];
  onReadToggle: (id: string, read: boolean) => void;
}

export function NoticeListContent({ loading, notices, onReadToggle }: NoticeListContentProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading notices...</p>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No notices found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {notices.map((notice) => (
        <NoticeCard 
          key={notice.id} 
          notice={notice} 
          onReadToggle={onReadToggle}
        />
      ))}
    </div>
  );
}
