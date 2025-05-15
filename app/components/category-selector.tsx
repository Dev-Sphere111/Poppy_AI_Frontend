"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type Category = {
  id: string
  name: string
  icon: string
}

const categories: Category[] = [
  { id: "web", name: "Web", icon: "🌐" },
  { id: "companies", name: "Companies", icon: "🏢" },
  { id: "linkedin", name: "LinkedIn", icon: "👔" },
  { id: "twitter", name: "Twitter", icon: "🐦" },
  { id: "news", name: "News", icon: "📰" },
  { id: "images", name: "Images", icon: "🖼️" },
  { id: "videos", name: "Videos", icon: "🎬" },
  { id: "academic", name: "Academic", icon: "🎓" },
]

interface CategorySelectorProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  onClick?: () => void
}

export default function CategorySelector({ selectedCategory, setSelectedCategory, onClick }: CategorySelectorProps) {
  const [showAll, setShowAll] = useState(false)

  const visibleCategories = showAll ? categories : categories.slice(0, 5)

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    if (onClick) onClick()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}

      {categories.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 transition-colors"
        >
          {showAll ? (
            <>
              <span>Less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
