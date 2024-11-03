import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { ArtworkApi } from '../../../../services/artwork-api/ArtworkApi'
import { ArtworkGetListResponse } from '../../../../types/response/ArtworkGetListResponse'
import { buildArtworkData } from '../build-artwork-data/build-artwork-data'

export const useGetArtworkData = () => {
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    initialPageParam: ArtworkApi.initialPage,
    getNextPageParam: (lastPage: ArtworkGetListResponse) => {
      return lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : null
    },
    queryKey: ['artwork-list'],
    queryFn: ({ pageParam }) => ArtworkApi.getList({ page: pageParam })
  })

  const normalizedArtworkList = useMemo(
    () => buildArtworkData(data?.pages ?? []),
    [data?.pages]
  )

  return {
    data: normalizedArtworkList,
    isFetching,
    fetchNextPage
  }
}
