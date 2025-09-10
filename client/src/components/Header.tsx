"use client";

import React, { useState } from "react";
import { User, Zap } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import DateDisplay from "@/components/dateDisplay";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=" flex flex-col items-center    bg-white shadow-md transition-colors duration-300">
      <div className="w-[77em] h-[35px] py-2 px-[10em]  flex items-center justify-between  bg-slate-800">
        <div className="flex items-center text-white  justify-between gap-2">
          <h6 className="text-[8px] font-extrabold ">Trending</h6>
          <div className="flex items-center  ">
            <div className="relative w-[70px] h-[20px] z-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-transparent opacity-50 rounded-full" />

              <div
                className="w-5 h-5 rounded-full absolute z-[999] bg-rose-400/90 flex items-center justify-center shadow-sm"
                aria-label="Lightning"
              >
                <Zap className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <p className="text-[10px] ">
              Here area brands and designers to look out for next year 2026{" "}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <a href="">
            <Facebook className="w-3 h-3 text-gray-200 hover:text-blue-400" />
          </a>

          <a href="">
            <Twitter className="w-3 h-3 text-gray-200 hover:text-blue-400" />
          </a>

          <a href="">
            <Instagram className="w-3 h-3 text-gray-200 hover:text-blue-400" />
          </a>

          <a href="">
            <Linkedin className="w-3 h-3 text-gray-200 hover:text-blue-400" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-around border-b-[1px]  border-gray-400 w-[77em]  h-[4rem]   ">
        <div className="flex items-center">
          <DateDisplay />
          <p>logo</p>
        </div>

        <div>
          <a href="" className="flex items-center gap-2">
            <div className="w-5 flex items-center justify-center h-5 rounded-full border-[0.4px] border-gray-600 ">
              <User className="w-5 h-5 text-gray-600 " />
            </div>

            <p className="text-[12px] font-semibold text-gray-600 ">Sign in</p>
          </a>
        </div>

        <main className="p-6">
          <Button variant="default" className="bg-rose-500/90 rounded-[3px] ">
            Subscribe
          </Button>
        </main>
      </div>

      <div className="flex items-center justify-around w-full">
        <div className="flex items-center px-2 py-1 border-l border-r border-gary-400  ">
          <button
            className=" text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        <nav className="hidden md:flex space-x-6">
            <Link
            href="/"
            >
              <div className="relative group">
            <button className="flex items-center font-bold text-blue-900  text-[10px] hover:text-rose-400/90">
              Home <span className="ml-1 text-[10px] "> ∨ </span>
            </button>
          </div>
            </Link>

            <Link
              href="/about"
            >
             <p className="text-blue-900 hover:text-rose-400/90   font-bold text-[10px]">
            About Us
          </p>
            </Link>
        

         <Link
         href="/features"
         >
            <div className="relative group">
            <button className="flex items-center font-bold text-blue-900 text-[10px] hover:text-rose-400/90">
              Features<span className="ml-1 text-[10px] "> ∨ </span>
            </button>
          </div>
         </Link>

         <Link
         href='/categories'
         >
           <div className="relative group">
            <button className="flex items-center font-bold text-blue-900  text-[10px] hover:text-rose-400/90">
              Categories <span className="ml-1 text-[10px] "> ∨ </span>
            </button>
          </div>
         </Link>
       
        <Link
        href='/contact'
        >
              <p className=" text-blue-900 hover:text-rose-400/90  font-bold  text-[10px]">
            Contact
          </p>
        </Link>
        
        </nav>

         <div className="hidden md:flex items-center border-0 rounded gap-2 overflow-hidden">
            <input 
              type="text" 
              placeholder="Search here..." 
              className="px-4 py-1 w-25 text-sm focus:outline-none placeholder:text-[11px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          <Search className="w-5 h-5 text-gray-400 " />
          </div>
      </div>
    </header>
  );
};

export default Header;
