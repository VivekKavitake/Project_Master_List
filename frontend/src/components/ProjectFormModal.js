// src/components/ProjectFormModal.js
import React, { useState } from 'react';
import '../styles/ProjectFormModal.css';

const ProjectFormModal = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(projectName);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className='modal'>
      <div className="modal-content">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Project Name:
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;
