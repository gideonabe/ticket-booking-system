"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface EventFiltersProps {
  selectedCategory: string
  searchQuery: string
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
}

const categories = ["all", "music", "sports", "arts", "technology", "business", "other"]

export function EventFilters({ selectedCategory, searchQuery, onCategoryChange, onSearchChange }: EventFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
