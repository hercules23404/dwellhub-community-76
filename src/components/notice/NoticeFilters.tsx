
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoticeFiltersProps {
  selectedTarget: string;
  setSelectedTarget: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  targetGroups: string[];
}

export function NoticeFilters({
  selectedTarget,
  setSelectedTarget,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  sortOption,
  setSortOption,
  targetGroups,
}: NoticeFiltersProps) {
  return (
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
  );
}
