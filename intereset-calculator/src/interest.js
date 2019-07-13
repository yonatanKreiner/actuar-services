const excel = require('./excel');

const getInterestDifferences = (tomorrow, debt) => {
    tomorrow.setDate(tomorrow.getDate() + 1);
    const accumulativeInterest = excel.getInterestByDate(tomorrow);
    return (accumulativeInterest * debt - debt);
}

module.exports = getInterestDifferences;