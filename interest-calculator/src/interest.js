const excel = require('./excel');

// Interest gov data
// https://ga.mof.gov.il/rate

const getInterestDifferences = (endDate, debtDate, debt, isLegalInterest) => {
    const accumulativeInterest = excel.recursiveDailyInterestFromDate(endDate, debtDate, debt, isLegalInterest);
    
    return (accumulativeInterest.toFixed(6) * debt - debt);
}

module.exports = getInterestDifferences;