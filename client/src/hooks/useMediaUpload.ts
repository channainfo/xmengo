import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface UseMediaUploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  onUploadStart?: () => void;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: Error) => void;
  uploadFn?: (file: File) => Promise<any>;
}

export function useMediaUpload({
  maxSizeInMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  maxWidth = 1920,
  maxHeight = 1080,
  aspectRatio,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  uploadFn,
}: UseMediaUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  // Validate file
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        };
      }

      // Check file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return {
          valid: false,
          error: `File size exceeds ${maxSizeInMB}MB limit`,
        };
      }

      return { valid: true };
    },
    [allowedTypes, maxSizeInMB]
  );

  // Resize image if needed
  const resizeImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        // If no resize needed, return original file
        if (!maxWidth && !maxHeight && !aspectRatio) {
          resolve(file);
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          
          img.onload = () => {
            // Calculate new dimensions
            let newWidth = img.width;
            let newHeight = img.height;
            
            // Resize if exceeds max dimensions
            if (maxWidth && img.width > maxWidth) {
              newWidth = maxWidth;
              newHeight = (img.height * maxWidth) / img.width;
            }
            
            if (maxHeight && newHeight > maxHeight) {
              newHeight = maxHeight;
              newWidth = (newWidth * maxHeight) / newHeight;
            }
            
            // Apply aspect ratio if specified
            if (aspectRatio) {
              if (newWidth / newHeight > aspectRatio) {
                newWidth = newHeight * aspectRatio;
              } else {
                newHeight = newWidth / aspectRatio;
              }
            }
            
            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, newWidth, newHeight);
            
            // Convert back to file
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to resize image'));
                  return;
                }
                
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                
                resolve(resizedFile);
              },
              file.type,
              0.9 // Quality
            );
          };
          
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
      });
    },
    [maxWidth, maxHeight, aspectRatio]
  );

  // Handle file upload
  const uploadMedia = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        setProgress(0);
        setError(null);
        
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        // Resize image if needed
        const processedFile = await resizeImage(file);
        
        // Call upload start callback
        if (onUploadStart) {
          onUploadStart();
        }
        
        // Upload file
        let result;
        if (uploadFn) {
          // Use provided upload function
          result = await uploadFn(processedFile);
        } else {
          // Default upload logic - simulate progress
          result = await new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
              progress += 10;
              setProgress(progress);
              
              if (progress >= 100) {
                clearInterval(interval);
                resolve({
                  url: URL.createObjectURL(processedFile),
                  fileName: processedFile.name,
                  fileSize: processedFile.size,
                  fileType: processedFile.type,
                });
              }
            }, 100);
          });
        }
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setError(error);
        
        // Show error toast
        showToast('error', error.message);
        
        // Call error callback
        if (onUploadError) {
          onUploadError(error);
        }
        
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile, resizeImage, uploadFn, onUploadStart, onUploadSuccess, onUploadError, showToast]
  );

  // Handle file input change
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      const file = files[0];
      await uploadMedia(file);
      
      // Reset input value to allow uploading the same file again
      event.target.value = '';
    },
    [uploadMedia]
  );

  return {
    uploadMedia,
    handleFileChange,
    isUploading,
    progress,
    error,
  };
}

export default useMediaUpload;
