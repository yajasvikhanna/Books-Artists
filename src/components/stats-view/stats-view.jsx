import React from 'react';

export const StatsView = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.checked).length;
  const incomplete = total - completed;

  return (
    <div className="stats-view">
      <p>
        Total Tasks:
        {' '}
        {total}
      </p>
      <p>
        Completed:
        {' '}
        {completed}
      </p>
      <p>
        Incomplete:
        {' '}
        {incomplete}
      </p>
    </div>
  );
};
