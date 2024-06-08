const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const sectionsController = require('../controllers/sectionsController');
const subsectionsController = require('../controllers/subsectionsController');
const documentsController = require('../controllers/documentsController');

// Project routes
router.get('/projects', projectsController.getAllProjects);
router.get('/projects/:projectId', projectsController.getProjectById);
router.post('/projects', projectsController.createProject);
router.put('/projects/:projectId', projectsController.updateProject);
router.delete('/projects/:projectId', projectsController.deleteProject);

// Section routes
router.get('/projects/:projectId/sections', sectionsController.getSectionsByProjectId);
router.post('/sections', sectionsController.createSection);
router.put('/sections/:sectionId', sectionsController.updateSection);
router.delete('/sections/:sectionId', sectionsController.deleteSection);

// Subsection routes
router.get('/sections/:sectionId/subsections', subsectionsController.getSubsectionsBySectionId);
router.post('/subsections', subsectionsController.createSubsection);
router.put('/subsections/:subsectionId', subsectionsController.updateSubsection);
router.delete('/subsections/:subsectionId', subsectionsController.deleteSubsection);

// Document routes
router.get('/subsections/:subsectionId/documents', documentsController.getDocumentsBySubsectionId);
router.post('/documents', documentsController.createDocument);
router.put('/documents/:documentId', documentsController.updateDocument);
router.delete('/documents/:documentId/:subsectionId', documentsController.deleteDocument);

module.exports = router;
