'use client'
import { Button } from '@/components/ui'
import { logoutUser } from '@/database/actions/auth'
import { BookOpen, LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  const session = useSession()
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ArticleAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button className="gap-2" onClick={logoutUser}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <Button variant="outline">{session.data?.user.name}</Button>
        </div>
      </div>
    </header>
  )
}

export default Header
