import * as React from 'react';
import './filter-buttons.scss';

export const FILTERS = {
  ALL: 'all',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
};

export const FilterButtons = ({ currentFilter, setFilter }) => (
  <div className="filter-buttons">
    {Object.entries(FILTERS).map(([key, value]) => (
      <button
        key={key}
        type="button"
        className={currentFilter === value ? 'active' : ''}
        onClick={() => setFilter(value)}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </button>
    ))}
  </div>
);
