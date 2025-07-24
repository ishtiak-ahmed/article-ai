'use client'
import SelectComponent from '@/components/common/SelectComponent'
import { Button, Input, Label } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/card'
import { useArticleSearch } from '@/hooks/useArticles'
import { useDebounce } from '@/hooks/useDebounce'
import { fetcher } from '@/lib/utilities/fetcher'
import { Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const FilterArticles = () => {
  const { searchQuery, handleSearch, handleFilterByTag, tag, clearSearch } = useArticleSearch()
  const [q, setQ] = useState(searchQuery || '')
  const debouncedQ = useDebounce(q, 20)
  const {data} = useSWR('/api/v1/tags', fetcher)
  const tagsOptions = data?.tags || []

  useEffect(() => {
    handleSearch(q)
  }, [debouncedQ])

  const handleClear = () => {
    setQ('')
    clearSearch()
  }

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      handleFilterByTag('')
    } else {
      handleFilterByTag(value)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Label>Search by text: </Label>
            <div className="relative flex-1 max-w-md mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles by title, content, tags..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Label>Search by tags: </Label>
            <div>
              <SelectComponent value={tag} options={[{value: 'all', label: 'All'}, ...tagsOptions]} onValueChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterArticles
