import * as React from 'react';
import { useEffect } from 'react';
import { Checkbox } from '../checkbox';
import { TodosContext } from '../../todo-context';
import './todo-list.scss';
import {
  FilterButtons,
  FILTERS,
} from '../filter-buttons/filter-buttons';
import '../filter-buttons/filter-buttons.scss';
import { SearchBar } from '../search-bar/search-bar';
import { StatsView } from '../stats-view/stats-view';
import { TaskDetail } from '../task-detail/task-detail';

export const TodoList = () => {
  const { todos, setTodos } = React.useContext(TodosContext);

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };
  // const editInputRef = React.useRef(null);
  const [editingId, setEditingId] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [filter, setFilter] = React.useState(FILTERS.ALL);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTodos = todos.filter((todo) => {
    if (filter === FILTERS.COMPLETED) {
      return todo.checked;
    }
    if (filter === FILTERS.INCOMPLETE) {
      return !todo.checked;
    }
    return true;
  });

  const searchedTodos = filteredTodos.filter(
    (todo) => todo.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleCheck = (id) => {
    const updatedTodos = todos.map(
      (todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo),
    );
    setTodos(updatedTodos);
  };

  const handleKeyUp = (e, id) => {
    if (e.keyCode === 13) {
      toggleCheck(id);
    }
  };

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(searchedTodos.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentPage, totalPages]);

  const paginatedTodos = searchedTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const [selectedTask, setSelectedTask] = React.useState(null);
  const closeTaskDetail = () => setSelectedTask(null);
  const ignoreBlurRef = React.useRef(false);
  const editInputRef = React.useRef(null);

  const startEditing = (id, currentLabel) => {
    setEditingId(id);
    setEditValue(currentLabel);
  };

  const saveEdit = () => {
    if (!editValue.trim()) {
      setEditingId(null);
      setEditValue('');
      return;
    }

    const updatedTodos = todos.map(
      (todo) => (todo.id === editingId ? { ...todo, label: editValue } : todo),
    );

    setTodos(updatedTodos);
    setEditingId(null);
    setEditValue('');
    ignoreBlurRef.current = false; // reset the flag
  };

  const handleEditKeyUp = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  };

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="todo-list">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterButtons currentFilter={filter} setFilter={setFilter} />
      <StatsView todos={todos} />
      <span className="todo-list-title">Things to do:</span>

      {todos.length > 0 ? (
        <div className="todo-list-content">
          {paginatedTodos.map((todoItem) => (
            <div key={todoItem.id} className="todo-item-wrapper">
              <div className="todo-item-content">
                <Checkbox
                  label={
                    editingId === todoItem.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        // onBlur={saveEdit}
                        onBlur={() => {
                          if (!ignoreBlurRef.current) {
                            saveEdit();
                          }
                        }}
                        onKeyUp={handleEditKeyUp}
                        aria-label="Edit Todo"
                      />
                    ) : (
                      todoItem.label
                    )
                  }
                  checked={todoItem.checked}
                  onClick={() => toggleCheck(todoItem.id)}
                  onKeyUp={(e) => handleKeyUp(e, todoItem.id)}
                  onDelete={() => handleDelete(todoItem.id)}
                  onLabelClick={() => setSelectedTask(todoItem)}
                />

                <div className="todo-actions">
                  {editingId === todoItem.id ? (
                    <button
                      type="button"
                      className="save-button"
                      onMouseDown={() => {
                        ignoreBlurRef.current = true;
                      }}
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => startEditing(todoItem.id, todoItem.label)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page
                {currentPage}
                of
                {totalPages}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="no-todos">
          Looks like you&apos;re up for a challenge!
        </div>
      )}

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={closeTaskDetail} />
      )}
    </div>
  );
};
