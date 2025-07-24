'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, RefreshCw, Tag } from 'lucide-react'
import { Article } from '@/lib/type'
import { comingSoonFeatures } from '@/lib/utilities/upcomingFeatures'
import {
  summarizeArticle,
  updateArticleSummary,
} from '@/database/actions/articles'
import { toast } from 'sonner'
import NewSummary from '../../components/NewSummary'

interface ArticleDetailsClientProps {
  article: Article
}

export function ArticleDetailsClient({ article }: ArticleDetailsClientProps) {
  const [currentSummary, setCurrentSummary] = useState(article.summary)
  const [newSummary, setNewSummary] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const regenerateSummary = async () => {
    setIsRegenerating(true)
    try {
      const generatedSummary = await summarizeArticle(article.content)
      console.log(generatedSummary, 'generated summary')
      if (!generatedSummary.success) {
        toast.error('Failed to generate summary')
      } else {
        setNewSummary(generatedSummary.reply)
        toast.success(
          `Summary generated successfully with ${generatedSummary.modelUsed} model`
        )
      }
    } catch (error) {
      toast.error('Failed to generate summary')
    }
    setIsRegenerating(false)
  }

  const useNewSummary = async () => {
    if (newSummary) {
      setCurrentSummary(newSummary)
      const res = await updateArticleSummary(article.id, {
        summary: newSummary,
      })
      console.log(res, 'update article summary res')
      setNewSummary(null)
    }
  }

  const keepOldSummary = () => {
    setNewSummary(null)
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold mt-6 mb-3 text-gray-900"
          >
            {line.slice(4)}
          </h3>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="text-2xl font-bold mt-8 mb-4 text-gray-900"
          >
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="text-3xl font-bold mt-8 mb-4 text-gray-900"
          >
            {line.slice(2)}
          </h1>
        )
      }

      // Code blocks
      if (line.startsWith('```')) {
        return (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto"
          >
            {line}
          </div>
        )
      }

      // Bullet points
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        )
      }

      // Bold text (simple **text** pattern)
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        )
      }

      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />
      }

      // Regular paragraphs
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Tags Section */}
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Summary
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateSummary}
                disabled={isRegenerating}
                className="gap-2 bg-transparent"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`}
                />
                {isRegenerating ? 'Generating...' : 'Regenerate'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Current Summary */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Current Summary</Badge>
              </div>
              <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                {currentSummary}
              </p>
            </div>

            {/* New Generated Summary */}
            {newSummary ? (
              <NewSummary
                newSummary={newSummary}
                useNewSummary={useNewSummary}
                keepOldSummary={keepOldSummary}
              />
            ) : null}
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-lg max-w-none p-8">
            <div className="text-gray-800 leading-relaxed">
              {formatContent(article.content)}
            </div>
          </CardContent>
        </Card>

        {/* Article Footer */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Share Article
              </Button>

              <Button onClick={comingSoonFeatures} size="sm">
                Edit Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
