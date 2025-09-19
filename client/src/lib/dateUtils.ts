/**
 * Formats a date string to a relative time format (e.g., "2 hours ago", "1 day ago")
 */
export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Less than 1 hour ago';
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
};

/**
 * Formats a date string to a localized date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Gets the most appropriate date (publishedAt if available, otherwise createdAt)
 */
export const getDisplayDate = (blog: { publishedAt?: string; createdAt: string }): string => {
  return blog.publishedAt || blog.createdAt;
};