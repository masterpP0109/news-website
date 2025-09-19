import React from "react";
import Image from "next/image";

interface CardProps {
  image: string;
  title: string;
 
}

const MoreDetails = ({image, title, } : CardProps ) => {
  return (
    <div className="flex w-full h-[60px] relative  items-center ">
      <Image
         src={image}
         alt={title}
         className="object-cover"
         fill
         priority
      />
    </div>
  );
};

export default MoreDetails;
