import React from 'react';
import './search-bar.scss';

export const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    className="search-bar"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
);
