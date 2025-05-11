import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="text-xl text-gray-200 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-gray-800 text-white rounded-full text-lg hover:bg-gray-600 transition duration-300"
        >
          Go to Task Panel
        </a>
      </div>
    </div>
  );
};

export default NotFound;
