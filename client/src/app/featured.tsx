"use client";
import React from 'react';
import { useBlogs } from '@/hooks/useBlogs';
import { ArticleSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArticleCard } from '@/components/ui/ArticleCard';

const Featured = () => {
  const { blogs: articles, loading, error, refetch } = useBlogs({
    endpoint: '/api/blogs/category/featured',
    published: true,
    limit: 2
  });

  if (loading) {
    return <ArticleSkeleton count={2} />;
  }

  if (error) {
    return (
      <section className="flex flex-col divide-y w-full max-w-sm mx-auto lg:mx-0 space-x-4 divide-gray-300 border border-r-gray-500 mb-12 px-2 border-b-0">
        <ErrorState message={error} onRetry={refetch} />
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="flex flex-col divide-y w-full max-w-sm mx-auto lg:mx-0 space-x-4 divide-gray-300 border border-r-gray-500 mb-12 px-2 border-b-0">
        <p className="text-gray-500 p-4">No featured articles available</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col divide-y w-full max-w-sm mx-auto lg:mx-0 space-x-4 divide-gray-300 border border-r-gray-500 mb-12 px-2 border-b-0">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          blog={article}
          variant="featured"
        />
      ))}
    </section>
  );
};

export default Featured;
