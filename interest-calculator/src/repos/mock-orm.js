const jsonfile = require('jsonfile');

const dbFilePath = 'src/repos/database.json';


/**
 * Fetch the json from the file.
 * 
 * @returns 
 */
function openDb() {
    return jsonfile.readFile(dbFilePath);
}


/**
 * Update the file.
 * 
 * @param db 
 * @returns 
 */
function saveDb(db) {
    return jsonfile.writeFile(dbFilePath, db);
}

module.exports = {openDb,saveDb}