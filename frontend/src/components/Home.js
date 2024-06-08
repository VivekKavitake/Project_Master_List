// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectTable from './ProjectTable';
import ProjectFormModal from './ProjectFormModal';
import '../styles/Home.css'; // Ensure this file exists

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

   // Function to capitalize the first letter of a string
   const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const response = await axios.get('http://localhost:5000/api/projects');
      console.log('Fetched projects:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addProject = async (projectName) => {
    try {
      const capitalizedProjectName = capitalizeFirstLetter(projectName); // Capitalize project name
      const newProjectData = { project_name: capitalizedProjectName }; // Use the capitalized project name in the request data
      console.log('Adding new project:', newProjectData);
      const response = await axios.post('http://localhost:5000/api/projects', newProjectData);
      const newProject = response.data;
      console.log('New project added:', newProject);
      setProjects([...projects, newProject]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      console.log('Deleting project with ID:', projectId);
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      console.log('Project deleted:', projectId);
      setProjects(projects.filter(project => project.project_id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="home">
      <h1>Project Master List</h1>
      <button onClick={() => setIsModalOpen(true)}>Add New Project</button>
      <ProjectTable projects={projects} deleteProject={deleteProject} />
      {isModalOpen && (
        <ProjectFormModal
          onClose={() => setIsModalOpen(false)}
          onSave={addProject}
        />
      )}
    </div>
  );
};

export default Home;
