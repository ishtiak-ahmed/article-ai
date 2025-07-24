'use server'

import { auth } from '@/auth'
import { db } from '@/database/drizzle'
import { articles } from '@/database/schema'
import { getResponseFromAi } from '@/lib/ai/openRouterAi'
import { Article } from '@/lib/type'
import { and, eq, like, or, sql } from 'drizzle-orm'

export const createArticle = async (params: any) => {
  const { title, content, summary, images = [], tags = [] } = params
  const session = await auth()
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated' }
  }
  const userId = session.user.id
  try {
    await db.insert(articles).values({
      title,
      content,
      summary,
      userId,
      images,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error('Create Article Error:', error)
    return { success: false, error: 'Failed to create article' }
  }
}

export const updateArticle = async (id: string, params: any) => {
  const { title, content, summary, images, tags } = params
  const session = await auth()
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated' }
  }
  const userId = session.user.id

  try {
    const updateValues = {
      ...(title && { title }),
      ...(content && { content }),
      ...(summary && { summary }),
      ...(images && { images }),
      ...(tags && { tags }),
      updatedAt: new Date(),
    }

    const result = await db
      .update(articles)
      .set(updateValues)
      .where(eq(articles.id, id))
      .returning()

    if (result.length === 0) {
      return { success: false, error: 'Article not found' }
    }

    return { success: true }
  } catch (error) {
    console.error('Update Article Error:', error)
    return { success: false, error: 'Failed to update article' }
  }
}

export const updateArticleSummary = async (id: string, params: any) => {
  const { summary } = params
  const session = await auth()
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated' }
  }
  const userId = session.user.id

  try {
    const result = await db
      .update(articles)
      .set({ summary, updatedAt: new Date() })
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()

    if (result.length === 0) {
      return { success: false, error: 'Article not found' }
    }

    return { success: true }
  } catch (error) {
    console.error('Update Article Summary Error:', error)
    return { success: false, error: 'Failed to update article' }
  }
}

export const deleteArticle = async (id: string) => {
  const session = await auth()
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated' }
  }
  const userId = session.user.id

  try {
    const result = await db
      .delete(articles)
      .where(and(eq(articles.id, id), eq(articles.userId, userId)))
      .returning()

    if (result.length === 0) {
      return { success: false, error: 'Article not found' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete Article Error:', error)
    return { success: false, error: 'Failed to delete article' }
  }
}

export const getArticles = async ({
  q,
  tag,
}: {
  q?: string
  tag?: string
}): Promise<Article[]> => {
  if (q) {
    // return getArticlesWithAiSearch(q, tag)
    return getArticleWithoutAiSearch(q, tag)
  } else {
    return getArticleWithoutAiSearch(q ?? '', tag)
  }
}

export async function getArticleById(id: string): Promise<Article> {
  const session = await auth()
  const userId = session!.user.id
  const result = await db
    .select()
    .from(articles)
    .where(and(eq(articles.userId, userId), eq(articles.id, id)))

  if (result.length) {
    return result[0] as Article
  } else {
    throw new Error('Article not found')
  }
}

export async function summarizeArticle(article: string) {
  try {
    if (!article || typeof article !== 'string') {
      return { error: 'Invalid article' }
    }
    // dummy summarization logic
    return {
      success: true,
      reply: article.slice(0, 200) + '...',
      modelUsed: 'Dummy Model',
    } // Placeholder for actual summarization logic

    // summarize with ai (need token)
    const message = `Summarize the following article in a SEO friendly way. Don't share any extra text like 'here it is'. Just share the summary text without any chars. Here is my content: ${article}`
    const res = await getResponseFromAi(message)
    return res
  } catch (err: any) {
    console.error('❌ Summarization Error:', err.message)
    return {
      error: 'Internal server error',
      detail: err.message,
      success: false,
    }
  }
}

const getArticleWithoutAiSearch = async (q: string, tag = '') => {
  const session = await auth()
  const userId = session!.user.id
  const conditions = [eq(articles.userId, userId)]
  if (tag) {
    conditions.push(sql`${articles.tags}::jsonb ? ${tag}`)
  }
  if (q) {
    conditions.push(
      or(like(articles.title, `%${q}%`), like(articles.content, `%${q}%`))
    )
  }

  const result = await db
    .select()
    .from(articles)
    .where(and(...conditions))

  return result as Article[]
}

// need openrouter ai api key to use this
const getArticlesWithAiSearch = async (q: string, tag: string) => {
  const session = await auth()
  const userId = session!.user.id
  const conditions = [eq(articles.userId, userId)]
  if (tag) {
    conditions.push(sql`${articles.tags}::jsonb ? ${tag}`)
  }
  if (q) {
    conditions.push(
      or(like(articles.title, `%${q}%`), like(articles.content, `%${q}%`))
    )
  }
  const relevantArticles = await db
    .select()
    .from(articles)
    .where(and(...conditions))

  const contextData = relevantArticles.reduce((acc, article, index) => {
    const articleEntry = `title: ${article.title}, tags: ${article.tags.join(', ')}`
    return acc + (index > 0 ? '\n\n' : '') + articleEntry
  }, '')

  const message = `Search for this "${q}" text in the following articles, which articles might be related to this query. Only return those articles titles, no extra chars in the reply. :\n\n${contextData}`
  const result = await getResponseFromAi(message)
  if (result.reply) {
    const titles = result.reply
      .split('\n')
      .map((title) => title.trim())
      .filter(Boolean)
    const filteredArticles = relevantArticles.filter((article) =>
      titles.includes(article.title)
    )
    return filteredArticles
  } else {
    console.error('AI Search Error:', result.error, result.detail)
    return []
  }
}
