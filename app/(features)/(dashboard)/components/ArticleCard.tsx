'use client'
import { Button } from '@/components/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  deleteArticle,
  summarizeArticle,
  updateArticleSummary,
} from '@/database/actions/articles'
import { Article } from '@/lib/type'
import { Edit, Eye, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { DeleteArticleDialog } from './DeleteArticle'
import { toast } from 'sonner'
import { Modal } from '@/components/common/Modal'
import ArticleSummary from './ArticleSummary'

const ArticleCard = ({ article }: { article: Article }) => {
  const router = useRouter()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [newSummary, setNewSummary] = useState<string | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const handleSummarize = async () => {
    setIsRegenerating(true)
    try {
      const res = await summarizeArticle(article.content)
      if (res.success) {
        toast.success('Summary generated successfully')
        setIsOpen(true)
        setNewSummary(res.reply)
      } else {
        toast.error('Failed to generate summary')
      }
    } catch (error) {
      console.log(error, 'summarize error')
    }
    setIsRegenerating(false)
    // todo
  }

  const handleReadMore = () => {
    router.push(`/articles/${article.id}`)
  }

  const handleDelete = async (id: string) => {
    const res = await deleteArticle(id)
    if (res.success) {
      toast.success('Article deleted successfully')
      router.refresh()
    } else {
      toast.error('Failed to delete article')
    }
  }

  const useNewSummary = async () => {
    if (newSummary) {
      const res = await updateArticleSummary(article.id, {
        summary: newSummary,
      })
      if (res.success) {
        setNewSummary(null)
        toast.success('Summary updated successfully')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error('Failed to update summary. Try again later.')
      }
    }
  }

  const keepOldSummary = () => {
    setNewSummary(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{article.title}</CardTitle>
              </div>
              <DeleteArticleDialog
                articleTitle={article.title}
                articleId={article.id}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base max-h-24 text-ellipsis overflow-hidden">
            {article.content.slice(0, 200)}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={handleSummarize}>
              {isRegenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
              {isRegenerating ? 'Summarizing...' : 'Summarize'}
            </Button>
            <Button variant="outline" onClick={handleReadMore}>
              <Eye className="h-4 w-4" /> Read more
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ArticleSummary
          currentSummary={article.summary}
          newSummary={newSummary}
          isRegenerating={isRegenerating}
          useNewSummary={useNewSummary}
          keepOldSummary={keepOldSummary}
          regenerateSummary={handleSummarize}
        />
      </Modal>
    </>
  )
}

export default ArticleCard
