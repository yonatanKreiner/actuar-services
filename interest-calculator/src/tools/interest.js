const excel = require('./excel');

// Interest gov data
// https://ga.mof.gov.il/rate

const getInterestDifferences = (endDate, debtDate, debt, interestType) => {
    // endDate.setDate(endDate.getDate() - 1);
    if(interestType === 'indexate-only'){
        return 0;
    }

    endDate.setHours(0,0,0);
    const accumulativeInterest = excel.recursiveDailyInterestFromDate(endDate, debtDate, interestType);
    
    return (accumulativeInterest * debt - debt);
}

module.exports = getInterestDifferences;