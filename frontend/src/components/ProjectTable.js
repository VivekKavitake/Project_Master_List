import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectTable.css';

const ProjectTable = ({ projects, deleteProject }) => {
  const navigate = useNavigate();

  const handleRowClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <table className="project-table">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(project => (
          <tr key={project.project_id} onClick={() => handleRowClick(project.project_id)}>
            <td>{project.project_name}</td> {/* Update to project_name */}
            <td>
              <button onClick={(e) => { e.stopPropagation(); deleteProject(project.project_id); }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable;
