import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
      />
      <SearchIcon className="search-icon" sx={{ fontSize: 30 }} />
    </div>
  );
};

export default SearchBar;
