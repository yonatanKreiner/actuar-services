const moment = require('moment');

const {indexate, getMadadByDate} = require('./madad');
const getInterestDifferences = require('./interest');

const calculate = (date, debts, isLegalInterest) => {
    const finalDebt = (debts.map(debt => addExtra(date, debt, isLegalInterest)))
        .reduce((a, b) => a + b, 0);

    return finalDebt;
};

const addExtra = (date, debt, isLegalInterest) => {
    const interestDifference = getInterestDifferences(moment(debt.date, 'DD/MM/YYYY').toDate(), debt.sum, isLegalInterest);
    
    const madadStart = getMadadByDate(moment(debt.date, 'DD/MM/YYYY').toDate());
    const madadEnd = getMadadByDate(moment(date, 'DD/MM/YYYY').toDate());
    
    const madadDifference = indexate(debt.sum, madadStart, madadEnd);
    const hazmadaRibit = indexate(interestDifference, madadStart, madadEnd);

    return debt.sum + madadDifference + interestDifference + hazmadaRibit;
};

module.exports = calculate;