const getInterestDifferences = async (db, date, debt) => {
    let tomorrow = new Date();
    tomorrow.setDate(date + 1);
    return (await getAccumulativePrecentage(db, tomorrow) * debt.sum - debt.sum);
}

const getAccumulativePrecentage = async (db, date) => {
    return await db.db.getInterestByDate(db.client, tomorrow)
};

export default getInterestDifferences;