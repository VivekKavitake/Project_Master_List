import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './Progressbar'; // Import the custom progress bar component
import fetchProjectName from '../utils/fetchProjectName';
import '../styles/ProjectDetail.css';
import { format, parseISO } from 'date-fns'; // Importing functions from date-fns

  const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('');
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSubsectionName, setNewSubsectionName] = useState('');
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentSubsectionId, setCurrentSubsectionId] = useState(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubsectionModalOpen, setIsSubsectionModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [editingDocument, setEditingDocument] = useState(null);

  // Define searchTerm, handleSearchChange, and searchResults here
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        const success = await fetchProjectDetails();
        if (success) {
          console.log('Details fetched');
        } else {
          console.log('No details fetched');
        }
      }
    };
    fetchData();
  }, [projectId]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchProjectDetails = async () => {
    try {
      const projectName = await fetchProjectName(projectId);
      setProjectName(capitalizeFirstLetter(projectName));
      await fetchSections(Number(projectId));
      return true;
    } catch (error) {
      console.error('Error fetching project details:', error);
      return false;
    }
  };

  const fetchSections = async (numericProjectId) => {
    try {
      const sectionsResponse = await axios.get(`http://localhost:5000/api/projects/${numericProjectId}/sections`);
      const sectionsWithSubsections = await Promise.all(sectionsResponse.data.map(async (section) => {
        const subsectionsResponse = await axios.get(`http://localhost:5000/api/sections/${section.section_id}/subsections`);
        const subsectionsWithDocuments = await Promise.all(subsectionsResponse.data.map(async (subsection) => {
          const documentsResponse = await axios.get(`http://localhost:5000/api/subsections/${subsection.subsection_id}/documents`);
          return { ...subsection, documents: documentsResponse.data };
        }));
        return { ...section, subsections: subsectionsWithDocuments };
      }));
      setSections(sectionsWithSubsections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  };

  const refetchProjectDetails = async () => {
    try {
      const projectName = await fetchProjectName(projectId);
      setProjectName(capitalizeFirstLetter(projectName));
      await fetchSections(Number(projectId));
    } catch (error) {
      console.error('Error refetching project details:', error);
    }
  };

  const handleAddSection = async () => {
    try {
      const numericProjectId = Number(projectId);
      await axios.post('http://localhost:5000/api/sections', { section_name: capitalizeFirstLetter(newSectionName), project_id: numericProjectId });
      setNewSectionName('');
      setIsSectionModalOpen(false);
      refetchProjectDetails();
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const handleAddSubsection = async () => {
    try {
      await axios.post('http://localhost:5000/api/subsections', { subsection_name: capitalizeFirstLetter(newSubsectionName), section_id: currentSectionId, project_id: projectId });
      setNewSubsectionName('');
      setIsSubsectionModalOpen(false);
      refetchProjectDetails();
    } catch (error) {
      console.error('Error adding subsection:', error);
    }
  };

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
    try {
      const section = sections.find((section) => section.section_id === currentSectionId);
      const subsection = section.subsections.find((subsection) => subsection.subsection_id === currentSubsectionId);

      await axios.post('http://localhost:5000/api/documents', {
        document_name: capitalizeFirstLetter(newDocumentName),
        subsection_id: currentSubsectionId,
        section_id: currentSectionId,
        project_id: projectId,
        start_date: null, // Add start_date, end_date, status, priority, assigned_to, and progress
        end_date: null,
        status: null,
        priority: null,
        assigned_to: null,
        progress: 0,
        section_name: section.section_name,
        subsection_name: subsection.subsection_name
      });
      setNewDocumentName('');
      setIsDocumentModalOpen(false);
      refetchProjectDetails();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/sections/${sectionId}`); // Delete section
      refetchProjectDetails(); // Refetch project details
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleDeleteSubsection = async (subsectionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/subsections/${subsectionId}`); // Delete subsection
      refetchProjectDetails(); // Refetch project details
    } catch (error) {
      console.error('Error deleting subsection:', error);
    }
  };

  const handleDeleteDocument = async (documentId, subsectionId) => {
    try {
      console.log('Deleting document with ID:', documentId, 'in subsection ID:', subsectionId);
      await axios.delete(`http://localhost:5000/api/documents/${documentId}/${subsectionId}`, {
        data: { section_id: currentSectionId, project_id: projectId } // Include section_id and project_id in the delete request
      });
      refetchProjectDetails(); // Refetch project details
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEditDocument = (document) => {
    // Format dates using date-fns
    const formattedDocument = {
      ...document,
      start_date: document.start_date ? format(parseISO(document.start_date), 'yyyy-MM-dd') : '',
      end_date: document.end_date ? format(parseISO(document.end_date), 'yyyy-MM-dd') : '',
      document_id: document.document_id // Ensure document_id is included
    };
    setEditingDocument(formattedDocument);
    setIsEditModalOpen(true);
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    try {
      // Format the dates before sending to the backend
      const formattedDocument = {
        ...editingDocument,
        start_date: editingDocument.start_date ? format(parseISO(editingDocument.start_date), 'yyyy-MM-dd') : '',
        end_date: editingDocument.end_date ? format(parseISO(editingDocument.end_date), 'yyyy-MM-dd') : '',
        status: editingDocument.status || 'NA', // Ensure status is included with the correct value
        priority: editingDocument.priority || 'NA', // Ensure priority is included with the correct value
      };

      await axios.put(`http://localhost:5000/api/documents/${editingDocument.document_id}`, formattedDocument);
      setIsEditModalOpen(false);
      refetchProjectDetails();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingDocument({ ...editingDocument, [name]: value });
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const toggleSubsection = (subsectionId) => {
    setCurrentSubsectionId(currentSubsectionId === subsectionId ? null : subsectionId); // Toggle current subsection ID
  };

  const toggleSection = (sectionId) => {
    setCurrentSectionId(currentSectionId === sectionId ? null : sectionId); // Toggle current section ID
  };

  // Filter documents based on the search term
  useEffect(() => {
    if (searchTerm) {
      const filteredDocuments = [];

      sections.forEach((section) => {
        section.subsections.forEach((subsection) => {
          const filteredDocs = subsection.documents.filter((doc) =>
            doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filteredDocs.length > 0) {
            filteredDocuments.push({
              section_name: section.section_name,
              subsection_name: subsection.subsection_name,
              section_id: section.section_id, // Add section_id
              subsection_id: subsection.subsection_id, // Add subsection_id
              documents: filteredDocs,
            });
          }
        });
      });

      setSearchResults(filteredDocuments);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, sections]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderDocuments = (documents, subsectionId) => {
    return (
      <>
        {documents.map((document) => (
          <li key={document.document_id}>
            <div className='document-dispaly'>
            <div className="document-item">
              <span className="document-name">{document.serial_number}-{document.document_name}</span>
              <button onClick={() => handleEditDocument(document)}>Edit</button>
              <button onClick={() => handleDeleteDocument(document.document_id, subsectionId)}>Delete</button>
            </div>
            <table className="document-details-table">
              <tbody>
                <tr>
                  <th>Start Date</th>
                  <td>{document.start_date ? format(parseISO(document.start_date), 'yyyy-MM-dd') : 'N/A'}</td>
                  <th>End Date</th>
                  <td>{document.end_date ? format(parseISO(document.end_date), 'yyyy-MM-dd') : 'N/A'}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{document.status || 'N/A'}</td>
                  <th>Priority</th>
                  <td>{document.priority || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Assigned To</th>
                  <td>{document.assigned_to || 'N/A'}</td>
                  <th>Progress</th>
                  <td><ProgressBar progress={document.progress || 0} /></td>
                </tr>
              </tbody>
            </table>
            </div>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="project-detail">
      <h1 style={{ textAlign: "center" }}>Project Details</h1>
      <h2 className="project-title">Project Title: {projectName}</h2>
      <button onClick={handleBack} className="back-button">Back</button>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search documents..."
        className="search-input"
      />
      <ul className="section-list">
        {searchTerm && searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <li key={index} className="section-item">
              <div className="breadcrumb">
                <span >{result.section_name}</span>
                <span className="separator">/</span>
                <span >{result.subsection_name}</span>
              </div>
              <ul className="document-list">
                {renderDocuments(result.documents, result.subsection_id)}
              </ul>
            </li>
          ))
        ) : (
        <div className="sections-container">
          <div className="sections-controls">
            <button onClick={() => setIsSectionModalOpen(true)} className="add-button">Add Section</button>
          </div>
          {sections.length > 0 ? (
            sections.map(section => (
              <div key={section.section_id} className="section">
                <button className="section-name" onClick={() => toggleSection(section.section_id)}>
                  {section.section_name}
                  <button className="delete-button" onClick={() => handleDeleteSection(section.section_id)}>Delete</button>
                </button>
                <button onClick={() => { setCurrentSectionId(section.section_id); setIsSubsectionModalOpen(true); }} className="add-button">Add Subsection</button>

                <div className={currentSectionId === section.section_id ? "subsection-container show" : "subsection-container hidden"}>
                  {section.subsections.length > 0 ? (
                    section.subsections.map(subsection => (
                      <div key={subsection.subsection_id} className="subsection">
                        <button className="subsection-name" onClick={() => toggleSubsection(subsection.subsection_id)}>
                          {subsection.subsection_name}
                          <button className="delete-button" onClick={() => handleDeleteSubsection(subsection.subsection_id)}>Delete</button>
                        </button>
                        <button onClick={() => { setCurrentSubsectionId(subsection.subsection_id); setIsDocumentModalOpen(true); }} className="add-button">Add Document</button>

                        <div className={currentSubsectionId === subsection.subsection_id ? "document-container show" : "document-container hidden"}>
                          {subsection.documents.length > 0 ? (
                            subsection.documents.map(document => (
                              <div key={document.document_id} className="document">
                                <ul>
                                  <li>{document.serial_number}-{document.document_name}</li>
                                </ul>
                                <table>
                                  <tbody>
                                    <tr>
                                      <th>Start Date</th>
                                      <td>{document.start_date || 'NA'}</td>
                                      <th>End Date</th>
                                      <td>{document.end_date || 'NA'}</td>
                                    </tr>
                                    <tr>
                                      <th>Status</th>
                                      <td>{document.status || 'NA'}</td>
                                      <th>Priority</th>
                                      <td>{document.priority || 'NA'}</td>
                                    </tr>
                                    <tr>
                                      <th>Assigned To</th>
                                      <td>{document.assigned_to || 'NA'}</td>
                                      <th>% Completed</th>
                                      <td>
                                        {document.progress !== null ? (
                                          <ProgressBar progress={document.progress} />
                                        ) : (
                                          'NA'
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <button className="edit-button" onClick={() => handleEditDocument(document)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDeleteDocument(document.document_id, subsection.subsection_id)}>Delete</button>
                              </div>
                            ))
                          ) : (
                            <p>No documents available.</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No subsections available.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No sections available.</p>
          )}
        </div>
      )}
      </ul>

      {isSectionModalOpen && (
        <div className="modal-overlay">
          <div className='modal'>
            <div className="modal-content">
              <h2>Add Section</h2>
              <input type="text" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} placeholder="Section Name" required />
              <button onClick={handleAddSection}>Add</button>
              <button onClick={() => setIsSectionModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isSubsectionModalOpen && (
        <div className="modal-overlay">
          <div className='modal'>
            <div className="modal-content">
              <h2>Add Subsection</h2>
              <input type="text" value={newSubsectionName} onChange={(e) => setNewSubsectionName(e.target.value)} placeholder="Subsection Name" required />
              <button onClick={handleAddSubsection}>Add</button>
              <button onClick={() => setIsSubsectionModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isDocumentModalOpen && (
        <div className="modal-overlay">
          <div className='modal'>
            <div className="modal-content">
              <h2>Add Document</h2>
              <input type="text" value={newDocumentName} onChange={(e) => setNewDocumentName(e.target.value)} placeholder="Document Name" required />
                <button onClick={handleSubmitDocument}>Add</button>
                <button onClick={() => setIsDocumentModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className='modal'>
            <div className="modal-content">
              <h2>Edit Document</h2>
              <form onSubmit={handleSaveDocument}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input type="date" name="start_date" value={editingDocument.start_date || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>End Date:</label>
                    <input type="date" name="end_date" value={editingDocument.end_date || ''} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={editingDocument.status || ''} onChange={handleChange}>
                      <option value="NA">NA</option>
                      <option value="Approved">Approved</option>
                      <option value="Started">Started</option>
                      <option value="Completed">Completed</option>
                      <option value="InReview">In review</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority:</label>
                    <select name="priority" value={editingDocument.priority || ''} onChange={handleChange}>
                      <option value="NA">NA</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Assigned To:</label>
                    <input type="text" name="assigned_to" value={editingDocument.assigned_to || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>% Completed:</label>
                    <input type="number" name="progress" min="0" max="100" value={editingDocument.progress || 0} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button className="cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 

export default ProjectDetail;