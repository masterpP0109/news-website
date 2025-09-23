"use client";

import React from 'react';
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const Sports = () => {
  const { blogs: articles } = useBlogs({
    endpoint: '/api/blogs/category/Sports,Swimming,Boxing,Basketball,Football',
    published: true,
    limit: 5
  });



  const sportsArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div>
      <WideSectionHeader
        title="Sports"
        className="mb-4"
      />

      <div className="w-auto h-auto flex gap-6 items-center justify-center">
        <div
        className="flex flex-col "
        >

      
        <div className="w-95 h-60 relative">
          <Image
            src={sportsArticle?.imageUrl || "/images/featuredArticle2.jpg"}
            alt="World Top News"
            fill
            className="object-cover rounded-[2px]"
            priority
          />
        </div>

        <div className="flex flex-col flex-1 justify-center">
          {sportsArticle ? (
            <>
              <p className="text-sm text-gray-500 mb-2">{sportsArticle.category}</p>
              <h1 className="text-[14px] font-bold text-gray-800 mb-4">{sportsArticle.title}</h1>

          

              <div className="flex items-center gap-4 mb-4">

                <span className="text-sm text-gray-500">
                  {new Date(sportsArticle.publishedAt || sportsArticle.createdAt).toLocaleDateString()}
                </span>
              </div>

           
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>No featured article available</p>
            </div>
          )}
        </div>
          </div>

        <div className="grid grid-cols-2 gap-2" >
           { articles.length > 1 ? articles.slice(1, 5).map((article, index) => (
              <div
              key={index}
              className="flex gap-[5px] items-center"
              >
                  <div className="w-20 h-15 relative inset-0  ">
                             <Image
                               src={article?.imageUrl || "/images/featuredArticle2.jpg"}
                               alt="image"
                               fill
                               className="object-cover rounded-[1px]"
                               priority
                             />
                           </div>
               <div
               className="flex flex-col flex-wrap w-40"
               >
                  <p className="text-[10px] text-gray-500 ">{article.category}</p>
               <h1 className="text-[12px] font-bold text-gray-800 ">{article.title}</h1>
                <span className="text-[9px] text-gray-500">
                   {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                 </span>
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

export default Sports;
