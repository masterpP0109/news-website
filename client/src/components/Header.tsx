"use client";

import React, { useState } from "react";
import { User, Zap, LogOut, X } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import DateDisplay from "@/components/dateDisplay";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const { data: session, status } = useSession();


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
             <div className="flex items-center rounded-full justify-center mb-4 w-[60px] h-[60px]">
                      <Image
                        src="/images/logo.png.png"
                        alt="logo"
                        width={60}
                        height={60}
                        className="object-cover rounded-[1px]"
                        priority
                      />
                    </div>
        </div>

        <div>
           {status === 'loading' ? (
             <div className="flex items-center gap-2">
               <div className="w-5 flex items-center justify-center h-5 rounded-full border-[0.4px] border-gray-600">
                 <User className="w-5 h-5 text-gray-600" />
               </div>
               <p className="text-[12px] font-semibold text-gray-600">Loading...</p>
             </div>
           ) : session ? (
             <div className="flex items-center gap-2">
               <div className="w-5 flex items-center justify-center h-5 rounded-full border-[0.4px] border-gray-600">
                 <User className="w-5 h-5 text-gray-600" />
               </div>
               <div className="flex flex-col">
                 <p className="text-[12px] font-semibold text-gray-600">{session.user?.name}</p>
                 <p className="text-[10px] text-gray-500 capitalize">{session.user?.role}</p>
               </div>
               <button
                 onClick={() => signOut()}
                 className="ml-2 text-gray-600 hover:text-gray-800"
                 title="Sign out"
               >
                 <LogOut className="w-4 h-4" />
               </button>
             </div>
           ) : (
             <Link href="/login" className="flex items-center gap-2">
               <div className="w-5 flex items-center justify-center h-5 rounded-full border-[0.4px] border-gray-600">
                 <User className="w-5 h-5 text-gray-600" />
               </div>
               <p className="text-[12px] font-semibold text-gray-600">Sign in</p>
             </Link>
           )}
         </div>

        <main className="p-6">
          <Button variant="default" className="bg-rose-500/90 rounded-[3px] ">
            Subscribe
          </Button>
        </main>
      </div>

      <div className="flex items-center justify-around w-full">
        <div className="flex items-center px-2 py-1 border-l border-r border-gray-400">
          <button
            className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors duration-200 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu Modal */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:left-0 lg:right-auto lg:w-64">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Always visible navigation */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Navigation</h3>
                  <div className="space-y-2">
                    <Link href="/" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Home
                    </Link>
                    <Link href="/about" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      About Us
                    </Link>
                    <Link href="/contact" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Categories - Always visible */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <div className="space-y-2">
                    <Link href="/categories/politics" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Politics
                    </Link>
                    <Link href="/categories/trending" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Trending
                    </Link>
                    <Link href="/categories/hotSpot" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Hot Spot
                    </Link>
                    <Link href="/categories/editors" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Editor,s Picks
                    </Link>
                    <Link href="/categories/featured" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Featured
                    </Link>
                  </div>
                </div>

                {/* Features - Always visible */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                  <div className="space-y-2">
                    <Link href="/features" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Premium Content
                    </Link>
                    <Link href="/newsletter" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Newsletter
                    </Link>
                    <Link href="/archives" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                      Archives
                    </Link>
                  </div>
                </div>

                {/* User-specific content */}
                {session ? (
                  <>
                    {/* User Dashboard Section */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">My Account</h3>
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md">
                          Welcome back, {session.user?.name}!
                        </div>
                        <Link href="/user" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                          My Dashboard
                        </Link>
                        <Link href="/user/profile" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                          Profile Settings
                        </Link>
                        <Link href="/user/bookmarks" className="block px-3 py-2 text-blue-900 hover:text-rose-400/90" onClick={() => setIsMenuOpen(false)}>
                          Bookmarks
                        </Link>
                      </div>
                    </div>

                    {/* Admin Section - Only for admins */}
                    {(session.user.role === 'admin' || session.user.role === 'superadmin') && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">🛠️ Admin Panel</h3>
                        <div className="space-y-2">
                          <Link href="/admin" className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            📈 Admin Dashboard
                          </Link>
                          <Link href="/admin/blogs" className="block px-3 py-2 text-green-600 hover:bg-green-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            ✍️ Manage Blogs
                          </Link>
                          <Link href="/admin/users" className="block px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            👥 Manage Users
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Super Admin Section - Only for super admins */}
                    {session.user.role === 'superadmin' && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">👑 Super Admin</h3>
                        <div className="space-y-2">
                          <Link href="/superadmin" className="block px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            🎯 Super Admin Dashboard
                          </Link>
                          <Link href="/superadmin/analytics" className="block px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            📊 Analytics
                          </Link>
                          <Link href="/superadmin/settings" className="block px-3 py-2 text-red-600 hover:bg-red-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                            ⚙️ System Settings
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Guest User Section */
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">🌟 Join Our Community</h3>
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-gray-600 bg-blue-50 rounded-md">
                        Sign up to access premium content and personalized news!
                      </div>
                      <Link href="/signup" className="block px-3 py-2 text-green-600 hover:bg-green-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                        ✍️ Create Account
                      </Link>
                      <Link href="/features" className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        💎 View Premium Features
                      </Link>
                    </div>
                  </div>
                )}

                {/* Authentication Section */}
                <div className="pt-4 border-t">
                  {session ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="hidden md:flex space-x-6">
            <div className="relative">
              <button
                className="flex items-center font-bold text-blue-900 text-[10px] hover:text-rose-400/90"
                onMouseEnter={() => setShowHomeDropdown(true)}
                onMouseLeave={() => setShowHomeDropdown(false)}
              >
                Home <span className="ml-1 text-[10px]">∨</span>
              </button>
              {showHomeDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => setShowHomeDropdown(true)}
                  onMouseLeave={() => setShowHomeDropdown(false)}
                >
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Latest News
                  </Link>
                  <Link href="/trending" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Trending
                  </Link>
                  <Link href="/featured" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Featured
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
            >
             <p className="text-blue-900 hover:text-rose-400/90   font-bold text-[10px]">
            About Us
          </p>
            </Link>
        

         <div className="relative">
           <button
             className="flex items-center font-bold text-blue-900 text-[10px] hover:text-rose-400/90"
             onMouseEnter={() => setShowFeaturesDropdown(true)}
             onMouseLeave={() => setShowFeaturesDropdown(false)}
           >
             Features<span className="ml-1 text-[10px]">∨</span>
           </button>
           {showFeaturesDropdown && (
             <div
               className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
               onMouseEnter={() => setShowFeaturesDropdown(true)}
               onMouseLeave={() => setShowFeaturesDropdown(false)}
             >
               <Link href="/features" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Premium Content
               </Link>
               <Link href="/newsletter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Newsletter
               </Link>
               <Link href="/archives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Archives
               </Link>
             </div>
           )}
         </div>

         <div className="relative">
           <button
             className="flex items-center font-bold text-blue-900 text-[10px] hover:text-rose-400/90"
             onMouseEnter={() => setShowCategoriesDropdown(true)}
             onMouseLeave={() => setShowCategoriesDropdown(false)}
           >
             Categories <span className="ml-1 text-[10px]">∨</span>
           </button>
           {showCategoriesDropdown && (
             <div
               className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
               onMouseEnter={() => setShowCategoriesDropdown(true)}
               onMouseLeave={() => setShowCategoriesDropdown(false)}
             >
               <Link href="/categories/politics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Politics
               </Link>
               <Link href="/categories/trending" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Trending
               </Link>
               <Link href="/categories/hotSpot" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Hot Spot
               </Link>
               <Link href="/categories/editors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Editors
               </Link>
               <Link href="/categories/featured" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 Featured
               </Link>
             </div>
           )}
         </div>
       
        <Link
        href='/contact'
        >
              <p className=" text-blue-900 hover:text-rose-400/90  font-bold  text-[10px]">
            Contact
          </p>
        </Link>

        {session && (
          <Link
            href={session.user.role === 'superadmin' ? '/superadmin' : session.user.role === 'admin' ? '/admin' : '/user'}
          >
            <p className=" text-blue-900 hover:text-rose-400/90  font-bold  text-[10px]">
              Dashboard
            </p>
          </Link>
        )}

        </nav>

          <div className="hidden md:flex items-center border-0 rounded gap-2 overflow-hidden">
             <input
               type="text"
               placeholder="Search here..."
               className="px-4 py-1 w-32 text-sm focus:outline-none placeholder:text-[11px]"
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
