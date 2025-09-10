import React from "react";
import Featured from "@/app/featured";
import Trending from "@/app/trending";
import Sidebar from "@/app/Sidebar";
import MoreDetails from "@/components/moreDetails";
import Politics from "@/app/politics"

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
      </div>

      <aside>
        <Sidebar />
      </aside>
    </div>
  );
};

export default page;
