"use client";
import Image from "next/image";
import { User } from "lucide-react";
import { useState, useEffect } from "react";

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

const HotSpot = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotSpotData = async () => {
      try {
        const response = await fetch('/api/blogs/category/HotSpot?published=true&limit=3');
        if (!response.ok) {
          throw new Error('Failed to fetch hotspot articles');
        }
        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHotSpotData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-[6px]">
          <h3>Today,s Hotspot</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[480px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <div className="flex p-2 gap-[3px] w-[600px] h-[350px] divide-x divide-gray-300">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col justify-evenly p-4">
              <div className="w-50 h-30 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
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
      <div>
        <div className="flex items-center gap-[6px]">
          <h3>Today,s Hotspot</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[480px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <p className="text-red-500 p-4">Error loading hotspot articles: {error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-[6px]">
          <h3>Today,s Hotspot</h3>
          <div className="w-[600px] h-[9px] flex gap-[6px]">
            <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
            <div>
              <div className="w-[480px] border-t border-b border-gray-400 h-[5px]"></div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 p-4">No hotspot articles available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-[6px]">
        <h3>Today,s Hotspot</h3>
        <div className="w-[600px] h-[9px] flex gap-[6px]">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
          <div>
            <div className="w-[480px] border-t border-b border-gray-400 h-[5px]"></div>
          </div>
        </div>
      </div>

      <div className="flex   p-2 gap-[3px] w-[600px] h-[350px] divide-w-[200px] divide-x divide-gray-300  ">
        {blogs.map((blog) => (
          <div key={blog._id}
            className="flex flex-col justify-evenly p-4 "  
          >
            <div className="w-50 h-30 relative inset-0  ">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover rounded-[1px]"
                priority
              />
            </div>

             <p className="text-[9px]  text-gray-500">
          {blog.category}
        </p>
        <h4 className="text-wrap text-[11px] ">{blog.title}</h4>

        <div className="flex gap-2 text-[9px] text-gray-500">
          <p className="flex gap-[1px] items-center justify-center " >   
            <span className="w-3 h-3 rounded-full border border-gray-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </span>{blog.author}</p>
          <p>{blog.createdAt}</p>
          <p>{blog.createdAt}</p>
          
        </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotSpot;
