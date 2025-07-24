import { vi, describe, it, expect, beforeEach } from 'vitest'
import { signIn } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import ratelimit from '@/lib/ratelimit'
import { loginUser } from '@/database/actions/auth'

// Mock dependencies
vi.mock('@/auth', () => ({
  signIn: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('@/lib/ratelimit', () => ({
  default: {
    limit: vi.fn(),
  },
}))

vi.mock('@/database/drizzle', () => ({
  db: {},
}))

describe('loginUser', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
    ;(headers as any).mockReturnValue({
      get: () => '127.0.0.1',
    })
  })

  it('should redirect if rate limit fails', async () => {
    ;(ratelimit.limit as any).mockResolvedValue({ success: false })

    await loginUser({ email, password })

    expect(redirect).toHaveBeenCalledWith('/too-fast')
  })

  it('should return success: true if login is successful', async () => {
    ;(ratelimit.limit as any).mockResolvedValue({ success: true })
    ;(signIn as any).mockResolvedValue({ ok: true })

    const result = await loginUser({ email, password })

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email,
      password,
      redirect: false,
    })

    expect(result).toEqual({ success: true })
  })

  it('should return error if login fails with result.error', async () => {
    ;(ratelimit.limit as any).mockResolvedValue({ success: true })
    ;(signIn as any).mockResolvedValue({ error: 'Invalid credentials' })

    const result = await loginUser({ email, password })

    expect(result).toEqual({ success: false, error: 'Invalid credentials' })
  })

  it('should return error if signIn throws', async () => {
    ;(ratelimit.limit as any).mockResolvedValue({ success: true })
    ;(signIn as any).mockRejectedValue(new Error('Something went wrong'))

    const result = await loginUser({ email, password })

    expect(result).toEqual({ success: false, error: 'Signin error' })
  })
})
