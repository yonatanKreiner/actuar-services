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
    
    const interestDifference = await getInterestDifferences(paymentDate, debtDate, debtSum, debt.interestType);

    let hazmadaMadad = 0;
    let hazmadaRibit = 0; 
    if(debt.interestType !== 'shekel-interest'){
        const hazmadaMadadPromise = getIndexate(debtSum, debtDate, paymentDate);
        const hazmadaRibitPromise = getIndexate(interestDifference, debtDate, paymentDate);

        const results = await Promise.all([hazmadaMadadPromise,hazmadaRibitPromise]);
        hazmadaMadad = results[0];
        hazmadaRibit = results[1];
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