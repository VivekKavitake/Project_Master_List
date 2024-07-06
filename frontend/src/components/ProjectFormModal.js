// src/components/ProjectFormModal.js
import React, { useState } from 'react';
import '../styles/ProjectFormModal.css';

const ProjectFormModal = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [contractor, setContractor] = useState('');
  const [consultant, setConsultant] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const projectData = { projectName, client, contractor, consultant, title };
    onSave(projectData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
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
            <label>
              Client:
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                required
              />
            </label>
            <label>
              Contractor:
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                required
              />
            </label>
            <label>
              Consultant:
              <input
                type="text"
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
                required
              />
            </label>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
