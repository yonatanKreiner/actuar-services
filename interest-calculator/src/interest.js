const excel = require('./excel');

// Interest gov data
// https://ga.mof.gov.il/rate

const getInterestDifferences = (tomorrow, debt, isLegalInterest) => {
    tomorrow.setDate(tomorrow.getDate() + 1);
    const accumulativeInterest = excel.recursiveDailyInterestFromDate(tomorrow, isLegalInterest);
    
    return (accumulativeInterest * debt - debt);
}

module.exports = getInterestDifferences;