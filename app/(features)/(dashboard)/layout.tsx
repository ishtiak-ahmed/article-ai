import React, { ReactNode } from 'react'
import { auth } from '@/auth'

import { redirect } from 'next/navigation'

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  if (!session?.user?.id) redirect('/login')
  return <>{children}</>
}
export default Layout
