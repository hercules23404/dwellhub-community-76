
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PropertySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PropertySearchBar({ searchQuery, setSearchQuery }: PropertySearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If needed, trigger an immediate search here
      console.log('Search query:', searchQuery);
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by location or property name..."
        value={searchQuery}
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
        className="pl-9 w-full"
        aria-label="Search properties"
      />
    </div>
  );
}
