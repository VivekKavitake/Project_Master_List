const db = require('../db');

exports.getAllProjects = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM projects');
        res.json(results);
    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProjectById = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const [results] = await db.query('SELECT * FROM projects WHERE project_id = ?', [projectId]);
        res.json(results[0]);
    } catch (err) {
        console.error("Error fetching project:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createProject = async (req, res) => {
    const { project_name } = req.body;
    try {
        const [results] = await db.query('INSERT INTO projects (project_name) VALUES (?)', [project_name]);
        res.status(201).json({ project_id: results.insertId, project_name });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const { project_name } = req.body;
    try {
        await db.query('UPDATE projects SET project_name = ? WHERE project_id = ?', [project_name, projectId]);
        res.json({ project_id: projectId, project_name });
    } catch (err) {
        console.error("Error updating project:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteProject = async (req, res) => {
    const projectId = req.params.projectId;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Delete all documents related to the project sections and subsections
        const [sections] = await connection.query('SELECT section_id FROM sections WHERE project_id = ?', [projectId]);
        const sectionIds = sections.map(section => section.section_id);
        if (sectionIds.length > 0) {
            await connection.query('DELETE FROM documents WHERE subsection_id IN (SELECT subsection_id FROM subsections WHERE section_id IN (?))', [sectionIds]);
        }

        // Step 2: Delete all subsections related to the sections of the project
        if (sectionIds.length > 0) {
            await connection.query('DELETE FROM subsections WHERE section_id IN (?)', [sectionIds]);
        }

        // Step 3: Delete all sections related to the project
        await connection.query('DELETE FROM sections WHERE project_id = ?', [projectId]);

        // Step 4: Delete the project itself
        await connection.query('DELETE FROM projects WHERE project_id = ?', [projectId]);

        await connection.commit();
        res.status(204).send();
    } catch (err) {
        await connection.rollback();
        console.error("Error deleting project:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
