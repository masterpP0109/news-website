"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Politics = () => {
  const articles = [
    {
      id: 1,
      category: "Politics",
      title: "Parliament Debates New Electoral Reforms Ahead of 2025 Elections",
      author: "Political Desk",
      date: "27 August, 2024",
      excerpt: "Lawmakers engaged in heated discussions over proposed... ",
      readTime: "8 Mins",
      image: "/images/politics1.jpg",
    },
    {
      id: 2,
      category: "Politics",
      title: "Regional Leaders Meet to Discuss Cross-Border Security Issues",
      author: "Admin",
      date: "2 September, 2024",
      excerpt: "Heads of state convened in Victoria Falls to strengthen....",
      readTime: "10 Mins",
      image: "/images/politics2.jpg",
    },
    {
      id: 3,
      category: "Politics",
      title: "Youth Movements Push for Stronger Climate Policies",
      author: "Staff Reporter",
      date: "7 September, 2024",
      excerpt: "Young activists are calling on the government... .",
      readTime: "6 Mins",
      image: "/images/politics3.jpg",
    },
  ];

  const subArticles = [
    { id: 1, title: "Local Elections See Record Turnout Amidst Political Tensions", date: "5 Sept, 2024" },
    { id: 2, title: "New Policies Aim to Boost Economic Growth in Rural Areas", date: "6 Sept, 2024" },
    { id: 3, title: "International Relations Strengthened Through New Trade Deals", date: "8 Sept, 2024" },
    { id: 4, title: "Government Launches Initiative to Improve Public Healthcare", date: "9 Sept, 2024" },
    { id: 5, title: "Debate Over Education Reforms Continues in Parliament", date: "10 Sept, 2024" },
    { id: 6, title: "Community Leaders Advocate for Social Justice Reforms", date: "11 Sept, 2024" },
  ];

  const [current, setCurrent] = useState(0);

  // independent sub-article slots
  const [slot1, setSlot1] = useState(0);
  const [slot2, setSlot2] = useState(1);
  const [slot3, setSlot3] = useState(2);

  // Main article rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [articles.length]);

  // Sub-article slots rotate at different times
  useEffect(() => {
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
  }, [subArticles.length]);

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
              key={activeArticle.id + "-image"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={activeArticle.image}
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
              key={activeArticle.id + "-text"}
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
                <p className="text-xs text-gray-500">{activeArticle.date}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {activeArticle.excerpt}
              </p>
              <button>
                <p>Read More</p> <span></span>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3 Independently Rotating Sub Articles */}
        <div className="w-[200px] border-l border-gray-300 pl-4 flex flex-col ">
          {[slot1, slot2, slot3].map((slot, index) => {
            const sub = subArticles[slot];
            return (
              <div
                key={index}
                className="border-b-2 text-gray-600 pb-2 mb-2 h-[60px] overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sub.id + "-sub"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h5 className="text-[0.7rem] font-bold text-gray-800">
                      {sub.title}
                    </h5>
                    <p className="text-xs text-gray-500">{sub.date}</p>
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
