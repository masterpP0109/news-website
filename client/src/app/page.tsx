import React from "react";
import Featured from "@/app/featured";
import Trending from "@/app/trending";
import Sidebar from "@/app/Sidebar";
import MoreDetails from "@/components/moreDetails";
import Politics from "@/app/politics";
import HotSpot from "@/app/hotSpot";

const page = () => {
  return (
    <div className="flex overflow-hidden px-[13em] ">
      <div>
        <main className="flex   gap-4 p-4">
          <Featured />
          <Trending />
        </main>
        <MoreDetails />
        <Politics/> 
         <HotSpot/>    
      </div>

      <aside>
        <Sidebar />
      </aside>
    </div>
  );
};

export default page;
