import { NextResponse } from 'next/server'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { auth } from '@/auth'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' })
  try {
    const usersRes = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .execute()
    return NextResponse.json({
      data: usersRes[0],
    })
  } catch (error) {
    console.error('DB error:', error)
    return NextResponse.json(
      { message: 'Failed to load users' },
      { status: 500 }
    )
  }
}
