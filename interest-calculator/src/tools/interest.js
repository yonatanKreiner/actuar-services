const excel = require('./excel');

// Interest gov data
// https://ga.mof.gov.il/rate

const getInterestDifferences = (endDate, debtDate, debt, isLegalInterest) => {
    // endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(0,0,0);
    const accumulativeInterest = excel.recursiveDailyInterestFromDate(endDate, debtDate, isLegalInterest);
    
    return (accumulativeInterest * debt - debt);
}

module.exports = getInterestDifferences;