import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  size?: 'small' | 'normal';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Tìm kiếm...",
  size = 'normal',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  // Smaller style for all sizes
  const inputClass = 'px-2 py-1 text-base h-10';
  const buttonClass = 'px-4 py-1 text-base h-10';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative flex items-center rounded-2xl shadow-lg p-1">
        {/* Stronger background: white layer + vibrant gradient */}
        <div className="absolute inset-0 rounded-2xl bg-white/80 z-0" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7e6bff]/80 via-[#00e09e]/80 to-[#7ee8c7]/80 z-10" />
        {/* Content */}
        <div className="relative flex items-center w-full z-20">
          {/* Search icon */}
          <div className="flex items-center justify-center w-9 h-9 bg-white/40 rounded-xl ml-1">
            <Search className="w-5 h-5 text-white/90" />
          </div>
          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent outline-none border-none text-white placeholder-white/90 ${inputClass}`}
          />
          {/* Button */}
          <button
            type="submit"
            className={`rounded-xl font-bold ${buttonClass} min-w-[90px] whitespace-nowrap bg-gradient-to-r from-[#a18fff] to-[#00e09e] text-white ml-2 transition-all duration-200 hover:from-[#7e6bff] hover:to-[#00c98b] shadow-md flex items-center justify-center`}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar; 