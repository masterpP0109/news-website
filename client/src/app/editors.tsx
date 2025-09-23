"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const Editors = () => {
  const { blogs: articles, loading, error } = useBlogs({
    endpoint: '/api/blogs/category/Editors',
    published: true,
    limit: 4
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editor&apos;s Picks</h3>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <WideSectionHeader title="Editor's Picks" className="mb-4" />

        <div className="flex gap-3 w-full h-[350px]">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-1 flex flex-col p-4 bg-gray-50 rounded animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editor&apos;s Picks</h3>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <WideSectionHeader title="Editor's Picks" className="mb-4" />
        <p className="text-red-500 p-4">Error loading Editor&apos;s picks articles: {error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editor&apos;s Picks</h3>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <WideSectionHeader title="Editor's Picks" className="mb-4" />
        <p className="text-gray-500 p-4">No editor&apos;s picks available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Editor&apos;s Picks</h3>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300 transition-transform"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 bg-white shadow-sm hover:bg-slate-100 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300 transition-transform"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <WideSectionHeader title="" className="mb-4" />

      <div className="flex gap-3 w-full h-[350px] divide-x divide-gray-300">
        {articles.map((article) => (
          <ArticleCard
            key={article._id}
            blog={article}
            variant="compact"
            className="flex-1 p-4"
          />
        ))}
      </div>
    </div>
  );
};

export default Editors;
