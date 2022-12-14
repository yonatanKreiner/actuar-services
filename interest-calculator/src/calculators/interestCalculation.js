const {getIndexate} = require('../tools/madad');
const {getInterestDifferences} = require('../tools/interest');

const interestCalculate = async (debts) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(debt)));
    const allDebtsResults = await allDepts;

    return {allDepts: Object.values(allDebtsResults)};
};

const addExtra = async (debt) => {
    console.log(`start calc debt: ${debt}`);
    const debtDate = new Date(debt.startDate);
    const paymentDate = new Date(debt.endDate);
    const debtSum = parseFloat(debt.sum);
    
    const interestDifference = getInterestDifferences(paymentDate, debtDate, debtSum, debt.interestType);

    let hazmadaMadad = 0;
    let hazmadaRibit = 0; 
    if(debt.interestType !== 'shekel-interest'){
        hazmadaMadad = await getIndexate(debtSum, debtDate, paymentDate);
        hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);
    }

    console.log(`end calc debt: ${debt}`);

    return {
        totalDebt: ((debtSum + hazmadaMadad + interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })),
        startDate: debt.startDate,
        interestType: debt.interestType,
        endDate: debt.endDate,
        sum: debt.sum,
        indexateSum: hazmadaMadad.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        totalInterest: (interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })
    };
};

module.exports = interestCalculate;