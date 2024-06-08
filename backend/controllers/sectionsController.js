const db = require('../db');

exports.getSectionsByProjectId = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const [results] = await db.query('SELECT * FROM sections WHERE project_id = ?', [projectId]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching sections:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createSection = async (req, res) => {
    const { section_name, project_id } = req.body;
    try {
        const [results] = await db.query('INSERT INTO sections (section_name, project_id) VALUES (?, ?)', [section_name, project_id]);
        res.status(201).json({ section_id: results.insertId, section_name, project_id });
    } catch (err) {
        console.error("Error creating section:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateSection = async (req, res) => {
    const sectionId = req.params.sectionId;
    const { section_name } = req.body;
    try {
        await db.query('UPDATE sections SET section_name = ? WHERE section_id = ?', [section_name, sectionId]);
        res.json({ section_id: sectionId, section_name });
    } catch (err) {
        console.error("Error updating section:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteSection = async (req, res) => {
    const sectionId = req.params.sectionId;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: all documents related to the section's subsections
        await connection.query('DELETE FROM documents WHERE subsection_id IN (SELECT subsection_id FROM subsections WHERE section_id = ?)', [sectionId]);
 
        // Step 2: Delete all subsections related to the section Delete
        await connection.query('DELETE FROM subsections WHERE section_id = ?', [sectionId]);
        
        // Step 3: Delete the section itself
        await connection.query('DELETE FROM sections WHERE section_id = ?', [sectionId]);

        await connection.commit();
        res.status(204).send();
    } catch (err) {
        await connection.rollback();
        console.error("Error deleting section:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
