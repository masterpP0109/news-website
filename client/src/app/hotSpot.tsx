import React from "react";

const HotSpot = () => {
  return (
    <div>
       <div className="flex items-center p-4 gap-4 ">
        <h3>Today,s Hot Spot</h3>
        <div className="w-[570px] h-[9px] flex gap-[6px]">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3"></div>
          <div>
            <div className="w-[510px] border-t border-b border-gray-400 h-[5px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotSpot;
