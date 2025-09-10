import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

const Featured = () => {
  const articles = [
    {
      id: 1,
      category: 'Business',
      title: "A Pragmatist's Guide To Their Lean User Research",
      author: 'Admin',
      date: '27 August, 2024',
      excerpt:
        'Browned butter and brown sugar caramelly goodness, crispy edges and soft centers.',
      readTime: '20 Mins',
      image: '/images/featuredArticles1.jpg', 
    },
    {
      id: 2,
      category: 'Tech',
      title: 'Five Data-Loading Patterns To Boost Web Performance',
      author: 'Admin',
      date: '27 August, 2024',
      excerpt:
        'Browned butter and brown sugar caramelly goodness, crispy edges and soft centers.',
      readTime: '15 Mins',
      image: '/images/featuredArticle2.jpg',
    },
  ];

  return (
    <section className="  flex flex-col divide-y w-[250px] space-x-4 divide-gray-300 border-[1px]
     border-r-gray-500 mb-12 px-[1px] border-b-0"> 
      {articles.map((article) => (
        <article key={article.id} className="flex flex-col py-4">
          {/* Article Image */}
          <div className="relative  h-30 w-[200px] mb-3">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover rounded-[1px] "
              priority={true} 
            />
          </div>

         
          <p className="text-xs text-gray-500">{article.category}</p>
          <h5 className="text-[0.7rem] font-bold text-gray-800">{article.title}</h5>

        
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </span>
              <p className="text-xs text-gray-500">{article.author}</p>
            </div>
            <p className="text-xs text-gray-500">{article.date}</p>
           
          </div>
        </article>
      ))}
    </section>
  );
};

export default Featured;
