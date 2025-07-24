import { useSearchParams, useRouter } from 'next/navigation'

export function useArticleSearch() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const router = useRouter()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('q', value)
      params.delete('page')
    } else {
      params.delete('q')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

    const handleFilterByTag = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('tag', value)
    } else {
      params.delete('tag')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return {
    searchQuery,
    handleSearch,
    clearSearch,
    tag,
    handleFilterByTag
  }
}

