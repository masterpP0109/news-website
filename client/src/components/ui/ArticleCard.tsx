import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Blog } from '@/types/blog';
import { formatDate, getDisplayDate } from '@/lib/dateUtils';

interface ArticleCardProps {
  blog: Blog;
  variant?: 'featured' | 'sidebar' | 'compact';
  className?: string;
  showImage?: boolean;
  showExcerpt?: boolean;
}

/**
 * Reusable article card component with different variants
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  blog,
  variant = 'featured',
  className = '',
  showImage = true,
  showExcerpt = false
}) => {
  const displayDate = getDisplayDate(blog);

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex flex-col items-start gap-2 my-2">
          <h5 className="text-[9px] text-gray-500 uppercase">{blog.category}</h5>
          <h3 className="text-[13px] font-medium">{blog.title}</h3>
          <p className="text-[9px] text-gray-500">
            {formatDate(displayDate)}
          </p>
        </div>

        {showImage && (
          <div className="flex items-center rounded-full justify-center mb-4 w-[60px] h-[60px]">
            <Image
              src={blog.imageUrl || '/images/default-article.jpg'}
              alt={blog.title}
              width={60}
              height={60}
              className="object-cover rounded-[1px]"
              priority
            />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={`flex flex-col py-2 ${className}`}>
        {showImage && (
          <div className="relative h-20 w-full mb-2">
            <Image
              src={blog.imageUrl || '/images/default-article.jpg'}
              alt={blog.title}
              fill
              className="object-cover rounded"
              priority
            />
          </div>
        )}

        <p className="text-xs text-gray-500">{blog.category}</p>
        <h5 className="text-sm font-medium text-gray-800 line-clamp-2">{blog.title}</h5>

        {showExcerpt && blog.excerpt && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{blog.excerpt}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-600" />
            </span>
            <p className="text-xs text-gray-500">{blog.author}</p>
          </div>
          <p className="text-xs text-gray-500">{formatDate(displayDate)}</p>
        </div>
      </article>
    );
  }

  // Default featured variant
  return (
    <article className={`flex flex-col py-4 ${className}`}>
      {showImage && (
        <div className="relative h-30 w-[200px] mb-3">
          <Image
            src={blog.imageUrl || '/images/default-article.jpg'}
            alt={blog.title}
            fill
            className="object-cover rounded-[1px]"
            priority
          />
        </div>
      )}

      <p className="text-xs text-gray-500">{blog.category}</p>
      <h5 className="text-[0.7rem] font-bold text-gray-800">{blog.title}</h5>

      {showExcerpt && blog.excerpt && (
        <p className="text-xs text-gray-600 mt-1">{blog.excerpt}</p>
      )}

      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </span>
          <p className="text-xs text-gray-500">{blog.author}</p>
        </div>
        <p className="text-xs text-gray-500">{formatDate(displayDate)}</p>
      </div>
    </article>
  );
};