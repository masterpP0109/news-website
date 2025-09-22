"use client";

import React from 'react';
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const WorldTopNews = () => {
  const { blogs: articles } = useBlogs({
    endpoint: '/api/blogs/category/world',
    published: true,
    limit: 10
  });



  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div>
      <WideSectionHeader
        title="World Top News"
        className="mb-4"
      />

      <div className="w-[50vw] h-auto flex flex-wrap  justify-between gap-[16px] ">
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
              <h1 className="text-[14px] font-bold text-gray-800 mb-4">{featuredArticle.title}</h1>

              {featuredArticle.excerpt && (
                <p className="text-gray-600 text-[12px] mb-4 line-clamp-3">{featuredArticle.excerpt}</p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">By {featuredArticle.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button className="bg-transparent text-blue-900 border-2 font-bold px-6 py-2 rounded hover:bg-rose-700 transition-colors w-fit">
                Read More
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>No featured article available</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 " >
           { articles.length > 1 ? articles.slice(1, 4).map((article, index) => (
              <div
              key={index}
              className="flex gap-[1px] items-center "
              >
               <div>
                  <p className="text-[10px] text-gray-500 ">{article.category}</p>
               <h1 className="text-[12px] font-bold text-gray-800 ">{article.title}</h1>
                <span className="text-[9px] text-gray-500">
                   {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                 </span>
               </div>

                <div className="w-25 h-15 relative inset-0  ">
                             <Image
                               src={article?.imageUrl || "/images/featuredArticle2.jpg"}
                               alt="image"
                               fill
                               className="object-cover rounded-[1px]"
                               priority
                             />
                           </div>
              </div>
           )) : (

             <div>
               <p>No additional articles found</p>
             </div>


           ) }
        </div>


      </div>
    </div>
  );
}

export default WorldTopNews;
