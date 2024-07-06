import ExcelJS from 'exceljs';

export const exportToExcel = (projectDetails, sections) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Project Details');

    // Function to apply styles to cells
    const applyStyles = (cell, style) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center align content
        cell.font = { bold: true, size: style.fontSize || 12 }; // Default font size is 12
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        if (style.backgroundColor) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: style.backgroundColor }
            };
        }
        cell.numFmt = style.format || undefined; // Number format
        if (style.rowHeight) {
            worksheet.getRow(cell.row).height = style.rowHeight; // Set row height
        }
        if (style.columnWidth) {
            worksheet.getColumn(cell.col).width = style.columnWidth; // Set column width
        }
    };

    // Add headers
    const headers = [
        'Sr.No',
        'Title of Document',
        'serial_number',
        'start_date',
        'end_date',
        'status',
        'priority',
        'Assigned to',
        'Progress in %'
    ];

    // Function to add project details as a section
    const addProjectDetails = (details) => {
        const detailRows = [
            ['Project Name', details.projectName],
            ['Client', details.client],
            ['Contractor', details.contractor],
            ['Consultant', details.consultant],
            ['Title', details.title]
        ];

        detailRows.forEach((row) => {
            const worksheetRow = worksheet.addRow(row);
            worksheetRow.eachCell((cell) => {
                applyStyles(cell, { fontSize: 12, rowHeight: 18 });
            });
        });

        worksheet.addRow([]); // Empty row for spacing
    };

    // Add project details to the worksheet
    addProjectDetails(projectDetails);

    // Add Header
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, colNumber) => {
        applyStyles(cell, { backgroundColor: 'FFCC00', fontSize: 14, rowHeight: 20 });
        worksheet.getColumn(colNumber).width = 20; // Set a default column width
    });

    // Function to add sections and their data to the worksheet
    const addDataToSectionsSheet = (section, sectionIndex) => {
        const sectionStartRow = worksheet.rowCount + 1;

        // Add section name with specific style
        const sectionNameCell = worksheet.getCell(`A${sectionStartRow}`);
        sectionNameCell.value = sectionIndex + 1;
        applyStyles(sectionNameCell, { backgroundColor: '00CCFF', fontSize: 14, rowHeight: 20 });

        const sectionTitleCell = worksheet.getCell(`B${sectionStartRow}`);
        sectionTitleCell.value = section.section_name;
        applyStyles(sectionTitleCell, { backgroundColor: '00CCFF', fontSize: 14, rowHeight: 20 });

        worksheet.mergeCells(`B${sectionStartRow}:I${sectionStartRow}`);

        if (section.subsections) {
            section.subsections.forEach((subsection, subsectionIndex) => {
                const subsectionStartRow = worksheet.rowCount + 1;

                // Add subsection name with specific style
                const subsectionNameCell = worksheet.getCell(`A${subsectionStartRow}`);
                subsectionNameCell.value = `${sectionIndex + 1}.${subsectionIndex + 1}`;
                applyStyles(subsectionNameCell, { backgroundColor: 'CCFFCC', fontSize: 12, rowHeight: 18 });

                const subsectionTitleCell = worksheet.getCell(`B${subsectionStartRow}`);
                subsectionTitleCell.value = subsection.subsection_name;
                applyStyles(subsectionTitleCell, { backgroundColor: 'CCFFCC', fontSize: 12, rowHeight: 18 });

                worksheet.mergeCells(`B${subsectionStartRow}:I${subsectionStartRow}`);

                if (subsection.documents) {
                    subsection.documents.forEach((document, documentIndex) => {
                        const documentStartRow = worksheet.rowCount + 1;

                        const documentNumberCell = worksheet.getCell(`A${documentStartRow}`);
                        documentNumberCell.value = documentIndex + 1;
                        applyStyles(documentNumberCell, { fontSize: 10, rowHeight: 16 });

                        const documentNameCell = worksheet.getCell(`B${documentStartRow}`);
                        documentNameCell.value = document.document_name;
                        applyStyles(documentNameCell, { fontSize: 10, rowHeight: 16 });

                        const documentDetails = [
                            `${document.serial_number}`,
                            document.start_date || 'N/A',
                            document.end_date || 'N/A',
                            document.status || 'N/A',
                            document.priority || 'N/A',
                            document.assigned_to || 'N/A',
                            document.progress || 'N/A'
                        ];

                        documentDetails.forEach((detail, index) => {
                            const cell = worksheet.getCell(`${String.fromCharCode(67 + index)}${documentStartRow}`);
                            cell.value = detail;
                            applyStyles(cell, { fontSize: 10, rowHeight: 16 });
                        });

                    });
                }
            });
        }
    };

    // Iterate over sections and add their data
    if (sections) {
        sections.forEach((section, index) => {
            addDataToSectionsSheet(section, index);
        });
    }

    // Save the workbook and trigger download
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectDetails.projectName}_Details.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    });
};
