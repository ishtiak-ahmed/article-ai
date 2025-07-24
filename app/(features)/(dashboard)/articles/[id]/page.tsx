import { notFound } from 'next/navigation'
import { ArticleDetailsClient } from './ArticleDetails'
import { getArticleById } from '@/database/actions/articles'
import Header from '../../components/Header'

// Mock function - replace with actual database query
async function getArticle(id: string) {
  const article = await getArticleById(id)
  return article
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticleDetailsPage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ArticleDetailsClient article={article} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.title,
    description: article.summary,
  }
}
