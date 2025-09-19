import React from 'react';

interface SectionHeaderProps {
  title: string;
  className?: string;
  titleClassName?: string;
  lineClassName?: string;
}

/**
 * Reusable section header with decorative line design
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = '',
  titleClassName = '',
  lineClassName = ''
}) => {
  return (
    <div className={className}>
      <div className="w-[150px] h-[9px] flex gap-[6px]">
        <div className={`h-[5px] w-[30px] bg-rose-500 transform skew-x-3 ${lineClassName}`}></div>
        <div>
          <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px]"></div>
        </div>
      </div>
      <h1 className={titleClassName}>{title}</h1>
    </div>
  );
};

/**
 * Alternative section header for different layouts
 */
export const WideSectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = '',
  titleClassName = '',
  lineClassName = ''
}) => {
  return (
    <div className={className}>
      <div className="flex flex-col justify-around gap-[14px]">
        <div className="w-full h-[30px] flex justify-between gap-[16px]">
          <h3 className={titleClassName}>{title}</h3>
        </div>
        <div className="w-full h-[9px] flex gap-[6px]">
          <div className={`h-[5px] w-[30px] bg-rose-500 transform skew-x-3 ${lineClassName}`}></div>
          <div>
            <div className="w-full border-t border-b border-gray-400 h-[5px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};