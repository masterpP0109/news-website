import { useState, useEffect } from 'react';
import { Blog, BlogResponse } from '@/types/blog';

interface UseBlogsOptions {
  endpoint: string;
  limit?: number;
  published?: boolean;
  category?: string;
}

interface UseBlogsReturn {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching blogs with consistent loading and error handling
 */
export const useBlogs = ({
  endpoint,
  limit,
  published,
  category
}: UseBlogsOptions): UseBlogsReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (published !== undefined) params.append('published', published.toString());
      if (category) params.append('category', category);

      const queryString = params.toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs from ${endpoint}`);
      }

      const data: BlogResponse = await response.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [endpoint, limit, published, category]);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs
  };
};