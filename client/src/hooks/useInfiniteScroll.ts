import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  fetchMore: (page: number) => Promise<any>;
  initialPage?: number;
  hasMoreData?: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  fetchMore,
  initialPage = 1,
  hasMoreData = true,
  threshold = 300,
}: UseInfiniteScrollOptions) {
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(hasMoreData);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Function to load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMore(page);
      
      // Check if there's more data to load
      if (!result || (Array.isArray(result) && result.length === 0)) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore]);

  // Set up intersection observer
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      }
    );

    // Observe the last element
    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading, threshold]);

  // Function to reset the infinite scroll
  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    loading,
    error,
    hasMore,
    lastElementRef,
    loadMore,
    reset,
    page,
  };
}

export default useInfiniteScroll;
