const db = require('../db');

exports.getDocumentsBySubsectionId = async (req, res) => {
    const subsectionId = req.params.subsectionId;
    try {
        const [results] = await db.query(`
            SELECT 
                document_id, document_name, subsection_id, section_id, serial_number, project_id, start_date, end_date, status, priority, assigned_to, progress
            FROM 
                documents 
            WHERE 
                subsection_id = ?
        `, [subsectionId]);

        // Format dates
        const formattedResults = results.map(document => ({
            ...document,
            start_date: document.start_date ? new Date(document.start_date).toISOString().split('T')[0] : null,
            end_date: document.end_date ? new Date(document.end_date).toISOString().split('T')[0] : null
        }));

        res.json(formattedResults);
    } catch (err) {
        console.error("Error fetching documents:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createDocument = async (req, res) => {
    const { document_name, subsection_id, section_id,project_id, start_date, end_date, status, priority, assigned_to, progress } = req.body;

    try {
        // Fetch project, section, and subsection names
        const [[project]] = await db.query('SELECT project_name FROM projects WHERE project_id = ?', [project_id]);
        const [[section]] = await db.query('SELECT section_name FROM sections WHERE section_id = ?', [section_id]);
        const [[subsection]] = await db.query('SELECT subsection_name FROM subsections WHERE subsection_id = ?', [subsection_id]);

        // Check if the fetched data exists
        if (!project || !section || !subsection) {
            return res.status(400).json({ error: 'Invalid project_id, section_id, or subsection_id' });
        }

        // Generate serial number
        const serial_number = generateSerialNumber(project.project_name, section.section_name, subsection.subsection_name, new Date());

        // Insert document into the database
        const [results] = await db.query(
            'INSERT INTO documents (document_name, subsection_id, serial_number, section_id, project_id, start_date, end_date, status, priority, assigned_to, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [document_name, subsection_id, serial_number, section_id, project_id, start_date, end_date, status, priority, assigned_to, progress]
        );

        res.status(201).json({
            document_id: results.insertId,
            document_name,
            subsection_id,
            serial_number,
            section_id,
            project_id,
            start_date,
            end_date,
            status,
            priority,
            assigned_to,
            progress
        });
    } catch (err) {
        console.error("Error creating document:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const generateSerialNumber = (projectName, sectionName, subsectionName, date) => {
  const shortDate = date.toISOString().slice(2, 10).replace(/-/g, '').slice(2, 6); // Extract MMDD
  const projectCode = projectName.slice(0, 3).toUpperCase();
  const sectionCode = sectionName.slice(0, 4).toUpperCase();
  const subsectionCode = subsectionName.slice(0, 3).toUpperCase();

  return `${projectCode}${sectionCode}${subsectionCode}${shortDate}`;
};


exports.updateDocument = async (req, res) => {
    try {
        const { documentId } = req.params; // Get documentId from URL params
        const { document_name, start_date, end_date, status, priority, assigned_to, progress } = req.body;

        // Ensure progress is a number
        const numericProgress = Number(progress);

        if (!documentId) {
            return res.status(400).json({ message: 'Document ID is required' });
        }

        const query = `
            UPDATE documents 
            SET 
                document_name = ?, 
                start_date = ?, 
                end_date = ?, 
                status = ?, 
                priority = ?, 
                assigned_to = ?, 
                progress = ?
            WHERE document_id = ?
        `;

        const values = [document_name, start_date, end_date, status, priority, assigned_to, numericProgress, documentId];

        await db.query(query, values);

        res.status(200).json({ message: 'Document updated successfully' });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Error updating document' });
    }
};

exports.deleteDocument = async (req, res) => {
    const { documentId, subsectionId } = req.params;
    const { section_id, project_id } = req.body; // Ensure these are included in the request body
    try {
        if (!documentId || !subsectionId) {
            return res.status(400).json({ error: 'Both documentId and subsectionId are required.' });
        }

        await db.query(
            'DELETE FROM documents WHERE document_id = ? AND subsection_id = ? AND section_id = ? AND project_id = ?', 
            [documentId, subsectionId, section_id, project_id]
        );

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting document:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
