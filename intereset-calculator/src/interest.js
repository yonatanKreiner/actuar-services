import { dateToString } from './utils';
let accumulativeInterests = [];

const getInterestDifferences = async (db, date, debt) => {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let per = await getAccumulativePrecentage(db, dateToString(date));
    return (1.074671066328 * debt - debt);
}

const getAccumulativePrecentage = async (db, date) => {
    // return await db.db.getInterestByDate(db.client, date);
    return accumulativeInterests.find(interest => dateToString(interest.date) === date).interest;
};

const initializeAccumulativeInterests = async (db) => {
    let interests = await db.db.getInterests(db.client);
    accumulativeInterests = calculateAccumulativeInterests(interests);
};

const calculateAccumulativeInterests = (interests) => {
    const lastIndex = interests.length - 1;
    let newInterests = [];

    newInterests[lastIndex] = {
        interest: 1 + interests[lastIndex].interest,
        date: interests[lastIndex].date
    };
    
    for (let index = lastIndex - 1; index >= 0; index--) {
        newInterests[index] = {
            interest: newInterests[index + 1].interest * (1 + interests[index].interest),
            date: interests[index].date
        };
    }

    return newInterests;
}

export default getInterestDifferences;

export {initializeAccumulativeInterests};