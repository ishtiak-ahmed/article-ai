import { z } from 'zod'

export const ArticleFormInput = z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(10),
    summary: z.string().min(10).max(500),
    userId: z.string().uuid(),
    images: z.array(z.string().url()).optional().default([]),
    tags: z.array(z.string().min(2)).optional().default([]),
})

export type ArticlePayload = z.infer<typeof ArticleFormInput>

export const RegisterCredentialsSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>
