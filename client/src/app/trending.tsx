"use client"; // if you're in Next.js App Router

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Trending = () => {
  const trending = [
    {
      id: 1,
      title: "Ethics as a Business Advantage",
      category: "Business",
      author: "Admin",
      date: "1 Sept, 2024",
      readTime: "10 Mins",
      image: "/images/trendingArticle.png",
       excerpt:
        'Browned butter and brown sugar caramelly goodness, crispy edges and soft centers.'
    },
    {
      id: 2,
      title: "Beyond Algorithms Skills Of Designers That AI",
      category: " Design",
      author: "Admin",
      date: "2 Sept, 2024",
      readTime: "15 Mins",
      image: "/images/trendingArticle.jpg",
       excerpt:
        'Browned butter and brown sugar caramelly goodness, crispy edges and soft centers.'
    },
    {
      id: 3,
      title: "Third TrendVR as a Tool for Empathy and Learning",
      category: "Tech",
      author: "Admin",
      date: "3 Sept, 2024",
      readTime: "8 Mins",
      image: "/images/featuredArticle2.jpg",
       excerpt:
        'Browned butter and brown sugar caramelly goodness, crispy edges and soft centers.'
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % trending.length);
    }, 7000); // changes every 4s
    return () => clearInterval(interval);
  }, [trending.length]);

  const trend = trending[current];

  return (
    <section className="flex justify-center">
      <div className="w-full flex flex-col items-center">
        {/* Image */}
        <div className="relative h-[330px] w-[440px] mb-3">
          <Image
            src={trend.image}
            alt={trend.title}
            fill
            className="object-cover rounded-[1px]"
            priority
          />
        </div>

        {/* Text */}
        <p className="text-[9px] px-[1px] py-[1px] border border-gray-300 text-gray-500">
          {trend.category}
        </p>
        <h4 className="text-wrap">{trend.title}</h4>

        <div className="flex gap-2 text-xs text-gray-500">
          <p>{trend.author}</p>
          <p>{trend.date}</p>
          <p>{trend.readTime}</p>
          
        </div>
        <div className="flex items-center text-center justify-center" >
             <p className="text-[12px] text-gray-500 " >{trend.excerpt}</p>
        </div>
        
      </div>
    </section>
  );
};

export default Trending;


/*
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

const Trending = () => {
  const trending = [
    { id: 1, title: "First Trend", category: "Business", author: "Admin", date: "1 Sept, 2024", readTime: "10 Mins", image: "/images/trend1.jpg" },
    { id: 2, title: "Second Trend", category: "Tech", author: "Admin", date: "2 Sept, 2024", readTime: "15 Mins", image: "/images/trend2.jpg" },
    { id: 3, title: "Third Trend", category: "Design", author: "Admin", date: "3 Sept, 2024", readTime: "8 Mins", image: "/images/trend3.jpg" },
  ];

  return (
    <section className="w-full">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        loop
      >
        {trending.map((trend) => (
          <SwiperSlide key={trend.id}>
            <div className="flex flex-col items-center">
              <div className="relative h-[250px] w-[400px] mb-3">
                <Image
                  src={trend.image}
                  alt={trend.title}
                  fill
                  className="object-cover rounded-[1px]"
                  priority
                />
              </div>

              <p className="text-[9px] px-[1px] py-[1px] border border-gray-300 text-gray-500">
                {trend.category}
              </p>
              <h4>{trend.title}</h4>

              <div className="flex gap-2 text-xs text-gray-500">
                <p>{trend.author}</p>
                <p>{trend.date}</p>
                <p>{trend.readTime}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Trending;
ccccccccccccccccc */