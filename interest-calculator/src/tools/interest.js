const excel = require('./excel');
const {getAll} = require('../repos/interest-repo');

// Interest gov data
// https://ga.mof.gov.il/rate

const getInterestDifferences = async (endDate, debtDate, debt, interestType) => {
    // endDate.setDate(endDate.getDate() - 1);
    if(interestType === 'indexate-only'){
        return 0;
    }

    endDate.setHours(0,0,0);
    const accumulativeInterest = await excel.recursiveDailyInterestFromDate(endDate, debtDate, interestType);
    
    return (accumulativeInterest * debt - debt);
}

const getInterestsTable = async () => {
    await excel.refreshExcelFiles();

    const interests = await getAll()

    return interests;
}

module.exports = {getInterestDifferences , getInterestsTable};