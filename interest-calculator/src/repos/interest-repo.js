const orm = require('./mock-orm');

/**
 * Get one annuity.
 * 
 * @param year
 * @returns 
 */
async function getOne(year) {
    const db = await orm.openDb();
    for (const annuity of db.annuities) {
        if (annuity.year == year) {
            return annuity;
        }
    }
    return null;
}

async function getAll() {
    const db = await orm.openDb();
    return db.interests;
}

async function updateAll(newInterests){
    const db = await orm.openDb();
    db.interests = newInterests;
    await orm.saveDb(db);
}

module.exports = {getOne, getAll, updateAll}