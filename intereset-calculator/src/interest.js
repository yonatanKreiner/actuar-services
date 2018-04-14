const getInterestDifferences = async (db, date, debt) => {
    let tomorrow = new Date();
    tomorrow.setDate(new Date(date).getDate() + 1);
    return (await getAccumulativePrecentage(db, tomorrow) * debt.sum - debt.sum);
}

const getAccumulativePrecentage = async (db, date) => {
    return await db.db.getInterestByDate(db.client, date)
};

export default getInterestDifferences;