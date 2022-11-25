const orm = require('./mock-orm');

/**
 * Get one annuity.
 * 
 * @param date
 * @returns 
 */
async function getOne(date) {
    const db = await orm.openDb();
    for (const annuity of db.annuities) {
        if (annuity.date === date) {
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