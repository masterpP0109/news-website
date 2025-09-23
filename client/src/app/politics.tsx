"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  createdAt: string;
  excerpt: string;
  imageUrl: string;
}

const Politics = () => {
  const [articles, setArticles] = useState<Blog[]>([]);
  const [subArticles, setSubArticles] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);

  // independent sub-article slots
  const [slot1, setSlot1] = useState(0);
  const [slot2, setSlot2] = useState(1);
  const [slot3, setSlot3] = useState(2);

  useEffect(() => {
    const fetchPoliticsData = async () => {
      try {
        const response = await fetch('/api/blogs/category/Politics?published=true&limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch politics articles');
        }
        const data = await response.json();
        const blogs = data.blogs || [];

        // Use first 3 for main articles, rest for sub-articles
        if (blogs.length > 0) {
          setArticles(blogs.slice(0, 3));
          setSubArticles(blogs.slice(3));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticsData();
  }, []);

  // Main article rotation
  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % articles.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [articles.length]);

  // Sub-article slots rotate at different times
  useEffect(() => {
    if (subArticles.length > 0) {
      const interval1 = setInterval(() => {
        setSlot1((prev) => (prev + 1) % subArticles.length);
      }, 5000);
      const interval2 = setInterval(() => {
        setSlot2((prev) => (prev + 1) % subArticles.length);
      }, 7000);
      const interval3 = setInterval(() => {
        setSlot3((prev) => (prev + 1) % subArticles.length);
      }, 9000);

      return () => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
      };
    }
  }, [subArticles.length]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center p-4">
          <h3>Politics</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[570px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 p-4">
          <div className="h-[170px] w-[240px] bg-gray-200 animate-pulse rounded"></div>
          <div className="flex flex-col w-[170px] gap-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center p-4">
          <h3>Politics</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[570px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <p className="text-red-500 p-4">Error loading politics articles: {error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div>
        <div className="flex items-center p-4">
          <h3>Politics</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[570px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 p-4">No politics articles available</p>
      </div>
    );
  }

  const activeArticle = articles[current];

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center p-4">
        <h3>Politics</h3>
        <div className="w-[600px] h-[9px] flex gap-[6px]">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
          <div>
            <div className="w-[570px] border-t border-b border-gray-400 h-[5px]"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        {/* Rotating Main Image */}
        <div className="relative h-[170px] w-[240px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArticle._id + "-image"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={activeArticle.imageUrl || '/images/default-article.jpg'}
                alt={activeArticle.title}
                fill
                className="object-cover rounded-[1px]"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rotating Main Article */}
        <div className="flex flex-col w-[170px] gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArticle._id + "-text"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="border-b pb-2"
            >
              <p className="text-xs text-gray-500">{activeArticle.category}</p>
              <h5 className="text-[0.8rem] font-bold text-gray-800">
                {activeArticle.title}
              </h5>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </span>
                  <p className="text-xs text-gray-500">{activeArticle.author}</p>
                </div>
                <p className="text-xs text-gray-500">{new Date(activeArticle.publishedAt || activeArticle.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {activeArticle.excerpt || 'Read more about this political development...'}
              </p>
              <button className="pt-4 w-[110px] h-[50px] rounded-lg " >
                <p>Read More</p> <span></span>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3 Independently Rotating Sub Articles */}
        <div className="w-[200px] border-l border-gray-300 pl-4 flex flex-col ">
          {[slot1, slot2, slot3].map((slot, index) => {
            const sub = subArticles[slot];
            if (!sub) return null; // Skip if no sub-article available
            return (
              <div
                key={index}
                className="border-b-2 text-gray-600 pb-2 mb-2 h-[60px] overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sub._id + "-sub"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h5 className="text-[0.7rem] font-bold text-gray-800">
                      {sub.title}
                    </h5>
                    <p className="text-xs text-gray-500">{new Date(sub.publishedAt || sub.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Politics;

