import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: ApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { showToast } = useToast();

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred. Please try again.',
  } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        
        if (showSuccessToast) {
          showToast('success', successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        setError(err);
        
        const message = err.response?.data?.message || errorMessage;
        
        if (showErrorToast) {
          showToast('error', message);
        }
        
        if (onError) {
          onError(err);
        }
        
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage, showToast]
  );

  return {
    data,
    isLoading,
    error,
    execute,
    reset: useCallback(() => {
      setData(null);
      setError(null);
    }, []),
  };
}

export default useApi;
