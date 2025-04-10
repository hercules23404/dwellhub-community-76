
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface NoticeListHeaderProps {
  title: string;
  onCreateClick: () => void;
}

export function NoticeListHeader({ title, onCreateClick }: NoticeListHeaderProps) {
  const { user } = useAuth();

  const handleCreateNotice = () => {
    if (!user) {
      toast.error("Please sign in to create a notice");
      return;
    }
    onCreateClick();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button className="shrink-0" onClick={handleCreateNotice}>
        <Plus className="h-4 w-4 mr-2" />
        Create Notice
      </Button>
    </div>
  );
}
