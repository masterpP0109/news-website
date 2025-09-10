

import { Calendar } from "lucide-react";


import React from 'react';

const DateDisplay = () => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

  return (
    <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-700" >
      <Calendar size={18} />
      <span>{formattedDate}</span>
    </div>
  );
};

export default DateDisplay;
