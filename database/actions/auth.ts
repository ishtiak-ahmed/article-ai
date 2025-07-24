'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { hash } from 'bcryptjs'
import { signIn, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { RegisterCredentials } from '@/lib/validations'
import ratelimit from '@/lib/ratelimit'

export const loginUser = async (
  params: Pick<RegisterCredentials, 'email' | 'password'>
) => {
  const { email, password } = params

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) return redirect('/too-fast')

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.log(error, 'Signin error')
    return { success: false, error: 'Signin error' }
  }
}

export const registerUser = async (params: RegisterCredentials) => {
  const { email, password, firstName, lastName } = params

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existingUser.length > 0) {
    return { success: false, error: 'Email already exists' }
  }

  const hashedPassword = await hash(password, 10)

  try {
    await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id })
    return { success: true }
  } catch (error) {
    console.log(error, 'Signup error')
    return { success: false, error: 'Signup error' }
  }
}

export const logoutUser = async () => {
  await signOut()
  redirect('/login')
}
