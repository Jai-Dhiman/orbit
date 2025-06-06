import { useQuery } from '@tanstack/react-query'
import { healthApi, handleApiError } from '../api/client'

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthApi.check,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minute
    select: (data) => ({
      status: data.status,
      timestamp: data.timestamp,
      database: data.database,
      dbCheck: data.dbCheck,
      error: data.error,
    }),
    meta: {
      errorMessage: 'Failed to check system health'
    }
  })
} 