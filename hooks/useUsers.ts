import useSWR from 'swr'
import { User } from '@/lib/type' // adjust path to your type

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<{
    data: User[]
    total: number
  }>('/api/v1/users', fetcher)

  return {
    users: data?.data || [],
    total: data?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<{
    data: User
  }>('/api/v1/users/me', fetcher)
  return {
    user: data?.data,
    isLoading,
    isError: error,
    mutate,
  }
}
