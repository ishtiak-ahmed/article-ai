
export type Article = {
  id: string
  title: string
  content: string
  images: string[]
  summary: string
  tags: string[]
}

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    name: string
    email: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    name: string
    email: string
  }
}