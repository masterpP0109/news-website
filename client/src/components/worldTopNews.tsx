"use client";

import React from 'react';
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const WorldTopNews = () => {
  const { blogs: articles } = useBlogs({
    endpoint: '/api/blogs/category/featured',
    published: true,
    limit: 1
  });

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div>
      <WideSectionHeader
        title="World Top News"
        className="mb-4"
      />

      <div className="flex gap-6">
        <div className="w-60 h-60 relative">
          <Image
            src={featuredArticle?.imageUrl || "/images/featuredArticle2.jpg"}
            alt="World Top News"
            fill
            className="object-cover rounded-[2px]"
            priority
          />
        </div>

        <div className="flex flex-col flex-1 justify-center">
          {featuredArticle ? (
            <>
              <p className="text-sm text-gray-500 mb-2">{featuredArticle.category}</p>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{featuredArticle.title}</h1>

              {featuredArticle.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">{featuredArticle.excerpt}</p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">By {featuredArticle.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors w-fit">
                Read More
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>No featured article available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorldTopNews;
