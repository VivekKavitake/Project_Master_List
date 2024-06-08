import axios from 'axios';

const fetchProjectName = async (projectId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
    return response.data.project_name;
  } catch (error) {
    console.error('Error fetching project name:', error);
    throw error;
  }
};

export default fetchProjectName;
