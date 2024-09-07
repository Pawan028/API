import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center space-x-2 bg-white rounded-lg shadow-lg overflow-hidden">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="flex-grow p-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-3 px-4 rounded-r-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 20a9 9 0 1 0-9-9 9 9 0 0 0 9 9zm0-4.5a4.5 4.5 0 1 1 4.5-4.5A4.5 4.5 0 0 1 11 15.5zM21 21l-6-6" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBox;
