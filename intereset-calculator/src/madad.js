const indexate = (value, madadStart, madadEnd) => {
    return (madadStart / madadEnd * value - value);
}

const getMadadByDate = async (db, date) => {
    let isoDate = new Date(date);
    const month = isoDate.getDate() < 15 ? 2 : 1;
    const madadDate = `${isoDate.getFullYear()}-${isoDate.getMonth() + 1 - month}-1`;

    return await getMadadByMonth(db, madadDate);
};

const getMadadByMonth = async (db, date) => {
    return await db.db.getMadadByDate(db.client, date)
};

export {indexate, getMadadByDate};