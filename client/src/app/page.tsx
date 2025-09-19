import React from "react";
import Featured from "@/app/featured";
import Trending from "@/app/trending";
import Sidebar from "@/app/Sidebar";
import MoreDetails from "@/components/moreDetails";
import Politics from "@/app/politics";
import HotSpot from "@/app/hotSpot";
import Editors from "./editors";
import WorldTopNews from "@/components/worldTopNews";

const page = () => {
  return (
    <div className="flex flex-col items-center  overflow-hidden">
      <section className="flex overflow-hidden px-[13em] ">
        <div>
          <main className="flex   gap-4 p-4">
            <Featured />
            <Trending />
          </main>
          <MoreDetails image="/images/details1.jpg" title="traveling" />
          <Politics />
          <HotSpot />
        </div>

        <aside>
          <Sidebar />
        </aside>
      </section>

      <section className="w-[31em] h-[4.8rem] ">
        <MoreDetails image="/images/details.jpg" title="cyber" />
      </section>

      <section className="w-[70vw] flex items-start   ">
        <Editors />
      </section>

      <section className="w-[75vw] flex overflow-hidden p-4 gap-2 ">
        <div>
          <main className="flex  p-4">
          <WorldTopNews/> 

          
          </main>
        </div>

        <aside>

        </aside>
      </section>
    </div>
  );
};

export default page;
