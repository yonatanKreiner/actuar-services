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
    return db.annuities;
}

module.exports = {getOne, getAll}