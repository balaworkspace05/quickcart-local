import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useImageUpload(bucket: 'product-images' | 'shop-images') {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return null;
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return null;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadProgress(50);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      toast.success('Image uploaded successfully!');
      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // Extract file path from URL
      const urlParts = url.split(`/${bucket}/`);
      if (urlParts.length < 2) return false;

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      toast.success('Image deleted successfully!');
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    uploadProgress
  };
}
