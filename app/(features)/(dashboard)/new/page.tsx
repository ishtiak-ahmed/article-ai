'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Plus, X, Tag } from 'lucide-react'
import { createArticle, summarizeArticle } from '@/database/actions/articles'
import Header from '../components/Header'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string(),
  tags: z.array(z.string()),
  tagInput: z.string().optional(),
  images: z.array(z.string())
})

type ArticleFormValues = z.infer<typeof articleSchema>

export default function NewArticlePage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      images: [],
      summary: '',
      tags: [],
      tagInput: ''
    },
    mode: 'onChange'
  })

  const tags = watch('tags')
  const content = watch('content')
  const summary = watch('summary')
  const tagInput = watch('tagInput')

  const generateSummary = async () => {
    if (!content.trim()) return

    try {
      const generatedSummary = await summarizeArticle(content)
      setValue('summary', generatedSummary?.reply || '')
      toast.success(`Summary generated successfully with ${generatedSummary.modelUsed} model`)
    } catch (error) {
      toast.error('Failed to generate summary')
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput?.trim() || ''
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag])
      setValue('tagInput', '')
    } else {
      toast.error('Tag already exists or is empty')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      const article = {
        title: data.title,
        content: data.content,
        summary: data.summary || '',
        tags: data.tags,
        user: '',
        images: []
      }

      const res = await createArticle(article)
      if (res.success) {
        toast.success('Article saved successfully!')
        router.push('/')
      } else {
        toast.error('Failed to save article. Please try again.')
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Article Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your article title..."
                {...register('title')}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput || ''}
                    onChange={(e) => setValue('tagInput', e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput?.trim()}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {tags.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add tags to help categorize your article. Press Enter or click the + button to add a tag.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start writing your article..."
                {...register('content')}
                className="min-h-[400px] text-base leading-relaxed"
              />
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Summary
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSummary}
                  disabled={isSubmitting || !content.trim()}
                >
                  Generate Summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-3">
                  <Badge variant="secondary" className="mb-2">
                    AI Generated
                  </Badge>
                  <Textarea
                    {...register('summary')}
                    className="min-h-[100px]"
                    placeholder="AI-generated summary will appear here..."
                  />
                  <p className="text-xs text-gray-500">
                    You can edit the AI-generated summary above or regenerate a new one.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Write some content above, then generate an AI summary</p>
                  <p className="text-sm text-gray-400 mt-1">
                    The AI will analyze your content and create a concise summary
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}