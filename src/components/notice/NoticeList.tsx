
import { useState } from "react";
import { NoticeData } from "./NoticeCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NoticeFilters } from "./NoticeFilters";
import { NoticeListHeader } from "./NoticeListHeader";
import { NoticeListContent } from "./NoticeListContent";
import { useNotices } from "./useNotices";

export function NoticeList({ className }: { className?: string }) {
  const { notices, loading, setNotices } = useNotices();
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");

  const handleCreateNotice = () => {
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
      <NoticeListHeader 
        title="Community Notices" 
        onCreateClick={handleCreateNotice} 
      />

      <NoticeFilters
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        targetGroups={targetGroups}
      />

      <NoticeListContent 
        loading={loading} 
        notices={filteredNotices}
        onReadToggle={(id, read) => {
          setNotices(prev => 
            prev.map(n => n.id === id ? {...n, read} : n)
          );
        }}
      />
    </div>
  );
}
