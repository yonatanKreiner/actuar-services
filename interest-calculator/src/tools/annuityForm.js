const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");

const getFormFromTemplate = (data) => {
    // Load the docx file as binary content
    const content = fs.readFileSync(
        './assets/annuity_form_template.docx',
        "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
        client_name: data.client_name,
        client_id: data.client_id,
        client_age: data.client_age,
        client_gender: data.client_gender,
        client_retirement: data.client_retirement,
        total_deposits: data.total_deposits,
        total_known_deposits: data.total_known_deposits,
        total_result: data.total_result
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    return buf;
}

module.exports = { getFormFromTemplate }