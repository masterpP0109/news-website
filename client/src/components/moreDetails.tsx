import React from 'react';

const MoreDetails = () => {
  return (
    <div className="flex w-full h-[60px] bg-gray-400 items-center " >
      <div className="flex " >
        <h1>Travelling Agents For Your</h1>

        <button
        className=" h-[15px] w-[100px] text-[12px] text-white flex items-center justify-center
        rounded-[23px] p-4 bg-gray-700  "
        >
            See Details
        </button>
      </div>
    </div>
  );
}

export default MoreDetails;
