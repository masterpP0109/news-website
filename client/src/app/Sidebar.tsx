import Image from "next/image";
import React from "react";

const Sidebar = () => {
  const topStories = [
    {
      title: "Leveraging Advanced AI ",
      author: "James Leith",
      timeAgo: "2 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "POLITICS",
    },
    {
      title: " Maximizing Your Data Value",
      author: "Sarah Kim",
      timeAgo: "4 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "TECH",
    },
    {
      title: "Reinforcing Your Strategy ",
      author: "Mike Chen",
      timeAgo: "6 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "BUSINESS",
    },
    {
      title: "Breaking The System ",
      author: "Lisa Wang",
      timeAgo: "8 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "FASHION",
    },
    {
      title: "Reinforcing Your Strategy ",
      author: "Tom Wilson",
      timeAgo: "10 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "SPORTS",
    },
    {
      title: "Take A Look Back At The Moment Data That Change Everything",
      author: "Emily Chen",
      timeAgo: "12 hours ago",
      image: "/api/placeholder/60/60",
      categorie: "MODERN",
    },
  ];

  return (
    <div className=" px-2  py-2" >
    <div className="flex flex-col w-[220px]  border-l-[1px]
     border-l-gray-500 mb-12 px-3 border-b-0 ">
      <div className="w-[150px] h-[9px]  flex  gap-[6px] ">
        <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3 "></div>

        <div>
          <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px] "></div>
        </div>
      </div>
      <h1>Top Stories</h1>
      <div  >
        <div
          className="flex flex-col divide-y  space-x-4 divide-gray-300 
           space-x-4 divide-gray-300 mb-12 px-3 border-b-0"
        >
          {topStories.map((story, index) => (
            <div 
            key={index}
            className="flex items-cenetr justify-between "
            
            >
              
              <div className="flex flex-col items-start gap-2 my-2 ">
                <h5 className="text-[9px] text-gray-500">{story.categorie}</h5>
                <h3 className="text-[13px] " >{story.title}</h3>
                <p className="text-[9px] text-gray-500" >{story.timeAgo}</p>
              </div>

              <div className="flex items-center rounded-full  justify-center mb-4 w-[60px] h-[60px] ">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={60}
                  height={60}
                  className="object-cover rounded-[1px]"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;
