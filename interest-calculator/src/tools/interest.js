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

const getInterestsTable = () => {
    const interests = {
        legalInterest: excel.getInterestsTable('legal-interest').data.slice(2).reverse(),
        illegalInterest: excel.getInterestsTable('illegal-interest').data.slice(2).reverse(),
        shekelInterest: excel.getInterestsTable('shekel-interest').data.slice(2).reverse()
    }

    return interests;
}

module.exports = {getInterestDifferences , getInterestsTable};