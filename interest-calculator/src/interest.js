const excel = require('./excel');

const getInterestDifferences = (tomorrow, debt, isLegalInterest) => {
    tomorrow.setDate(tomorrow.getDate() + 1);
    const accumulativeInterest = excel.getInterestByDate(tomorrow, isLegalInterest);
    return (accumulativeInterest * debt - debt);
}

module.exports = getInterestDifferences;