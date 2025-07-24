import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { BookOpen, Plus } from 'lucide-react'
import { getArticles } from '@/database/actions/articles'
import Header from './components/Header'
import ArticleCard from './components/ArticleCard'
import FilterArticles from './components/FilterArticles'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const {q= '', tag = ''} = await searchParams
  const articles = await getArticles({q: q as string, tag: tag as string})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Articles */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Articles</h1>
          <Link href="/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Write New Article
            </Button>
          </Link>
        </div>

        <FilterArticles />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="mb-2">No articles yet</CardTitle>
              <CardDescription className="mb-4">
                Start writing your first article to share your knowledge with
                the world.
              </CardDescription>
              <Link href="/new">
                <Button>Write Your First Article</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
