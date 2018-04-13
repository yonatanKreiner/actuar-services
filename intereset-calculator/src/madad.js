const indexate = (value, madadStart, madadEnd) => {
    return (madadStart / madadEnd * value - value);
}

const getMadadByDate = async (db, date) => {
    if (date.day < 15) {
        return await getMadadByMonth(db, date.month - 2);
    } else {
        return await getMadadByMonth(db, date.month - 1);
    }
};

const getMadadByMonth = async (db, date) => {
    return await db.db.getMadadByDate(db.client, date)
};

export {indexate, getMadadByDate};