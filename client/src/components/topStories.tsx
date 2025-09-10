import React from 'react';

const TopStories = ({ stories }) => {
  return (
    <section className="bg-gray-100 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Top Stories</h2>
      <ol className="list-decimal list-inside">
        {stories.map((story, index) => (
          <li key={index} className="mb-2 text-sm font-semibold hover:text-blue-600 cursor-pointer">
            {story}
            <span className="block text-xs text-gray-500 font-normal">27 August, 2024</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
