import React from 'react';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex-1">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <h6 className="text-lg text-gray-600 mt-4">
            The page you’re looking for doesn’t exist.
          </h6>
          <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Back Home
          </button>
        </div>
        <div className="flex-1">
          <img
            src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
            alt="Error"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
