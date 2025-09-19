"use client";
import React from "react";
import { useBlogs } from '@/hooks/useBlogs';
import { SidebarSkeleton } from '@/components/ui/LoadingSkeleton';
import { InlineError } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const Sidebar = () => {
  const { blogs: topStories, loading, error, refetch } = useBlogs({
    endpoint: '/api/blogs',
    published: true,
    limit: 3
  });

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="px-2 py-2">
      <div className="flex flex-col w-[220px] border-l-[1px] border-l-gray-500 mb-12 px-3 border-b-0">
        <SectionHeader title="Top Stories" />

        {error && <InlineError message={error} />}

        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {topStories.map((story) => (
            <ArticleCard
              key={story._id}
              blog={story}
              variant="sidebar"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

