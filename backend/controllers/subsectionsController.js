const db = require('../db');

exports.getSubsectionsBySectionId = async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
        const [results] = await db.query('SELECT * FROM subsections WHERE section_id = ?', [sectionId]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching subsections:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createSubsection = async (req, res) => {
    const { subsection_name, section_id, project_id } = req.body;
    try {
        const [results] = await db.query('INSERT INTO subsections (subsection_name, section_id, project_id) VALUES (?, ?, ?)', [subsection_name, section_id, project_id]);
        res.status(201).json({ subsection_id: results.insertId, subsection_name, section_id, project_id });
    } catch (err) {
        console.error("Error creating subsection:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateSubsection = async (req, res) => {
    const subsectionId = req.params.subsectionId;
    const { subsection_name, section_id, project_id } = req.body;
    try {
        await db.query('UPDATE subsections SET subsection_name = ?, section_id = ?, project_id = ? WHERE subsection_id = ?', [subsection_name, section_id, project_id, subsectionId]);
        res.json({ subsection_id: subsectionId, subsection_name, section_id, project_id });
    } catch (err) {
        console.error("Error updating subsection:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteSubsection = async (req, res) => {
    const subsectionId = req.params.subsectionId;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Delete all documents related to the subsection
        await connection.query('DELETE FROM documents WHERE subsection_id = ?', [subsectionId]);

        // Step 2: Delete the subsection itself
        await connection.query('DELETE FROM subsections WHERE subsection_id = ?', [subsectionId]);

        await connection.commit();
        res.status(204).send();
    } catch (err) {
        await connection.rollback();
        console.error("Error deleting subsection:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
