"use client";

import { useState, useEffect, useCallback } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncOptions = { immediate: true }
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: errorObj });
      throw errorObj;
    }
  }, dependencies);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for data fetching
export function useFetch<T>(
  url: string | null,
  options?: RequestInit
) {
  return useAsync(
    async () => {
      if (!url) throw new Error("URL is required");
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json() as Promise<T>;
    },
    [url, JSON.stringify(options)],
    { immediate: !!url }
  );
}

// Mock data hook for development
export function useMockData<T>(
  data: T,
  delay: number = 1000,
  shouldError: boolean = false
) {
  return useAsync(
    async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (shouldError) {
        throw new Error("Mock error occurred");
      }
      
      return data;
    },
    [data, delay, shouldError]
  );
} 