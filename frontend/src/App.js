import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import axios from 'axios'; // Import Axios for making HTTP requests
import './App.css';

const App = () => {
  // Add baseURL for Axios to point to your backend server
  axios.defaults.baseURL = 'http://localhost:5000'; // Adjust URL as per your backend server

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass projectId as a prop to ProjectDetail */}
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        
      </Routes>
    </Router>
  );
};

export default App;
