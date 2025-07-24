import { auth } from '@/auth'
import { db } from '@/database/drizzle'
import { articles } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user.id) {
      return { success: false, error: 'User not authenticated' }
    }
    const userId = session.user.id
    const result = await db
      .select({ tags: articles.tags })
      .from(articles)
      .where(eq(articles.userId, userId))
    const uniqueTags = Array.from(
      new Set(result.map((article) => article.tags).flat())
    )
    const tagsOptions = uniqueTags.map((tag) => ({ value: tag, label: tag }))
    return NextResponse.json({ success: true, tags: tagsOptions })
  } catch (err: any) {
    console.error('❌ API Chat Error:', err.message)
    return NextResponse.json(
      {
        error: 'Internal server error',
        detail: err.message,
      },
      { status: 500 }
    )
  }
}
