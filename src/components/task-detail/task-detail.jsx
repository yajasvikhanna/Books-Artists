import React, { useRef, useEffect } from 'react';

export const TaskDetail = ({ task, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!task) {
    return null;
  }

  // Function to handle outer container keyboard actions
  const handleOuterKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose();
    }
  };

  return (
    // This is an interactive element by default (button)
    <button
      onClick={onClose}
      onKeyDown={handleOuterKeyDown}
      aria-label="Close task detail"
      type="button"
      ref={modalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: 0,
        border: 'none',
        cursor: 'default',
      }}
    >
      {/* Using a proper interactive element (button) */}
      <button
        // aria-modal="true"
        // role="dialog"
        type="button"
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          width: '300px',
          textAlign: 'left',
          border: 'none',
          cursor: 'text',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p>
          <strong>Label:</strong>
          <br />
          {task.label}
        </p>
        <p>
          <strong>Status:</strong>
          <br />
          {task.checked ? '✅ Completed' : '❌ Incomplete'}
        </p>
      </button>
    </button>
  );
};
