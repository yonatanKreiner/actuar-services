const {getIndexate} = require('../tools/madad'); 

const independentWorkerSalaryPrec = 16;
const workerSalaryPrec = 12.5;

const CalculateSalaryDetermine = async (salaries, calculationDate, isIndependendWorker) => {
    const salariesSumsPromise = salaries.map(async salary => {
        const totalReturn = parseFloat(salary.sumEmployee) + parseFloat(salary.sumCompany);
        let returnPrecOfSalary = totalReturn / parseFloat(salary.sum); 
        if(!isIndependendWorker && returnPrecOfSalary < workerSalaryPrec){
            returnPrecOfSalary = workerSalaryPrec;
        }else if(isIndependendWorker && returnPrecOfSalary < independentWorkerSalaryPrec){
            returnPrecOfSalary = independentWorkerSalaryPrec;
        }

        const monthlyDetermineSalary = totalReturn / returnPrecOfSalary;

        const indexateStartDate = new Date(salary.date);
        indexateStartDate.setMonth(-2);
        const monthlyDetermineSalaryIndexate = await getIndexate(monthlyDetermineSalary, indexateStartDate, new Date(calculationDate));
     
        return ({
            totalReturn: totalReturn,
            returnPrecOfSalary: returnPrecOfSalary,
            monthlyDetermineSalary: monthlyDetermineSalary,
            monthlyDetermineSalaryIndexate:  monthlyDetermineSalaryIndexate + monthlyDetermineSalary 
        });
    });

    const salariesSums = await Promise.all(salariesSumsPromise)
    const lastThreeAvg = (salariesSums[salariesSums.length - 1].monthlyDetermineSalaryIndexate +
                            salariesSums[salariesSums.length - 2].monthlyDetermineSalaryIndexate +
                            salariesSums[salariesSums.length - 3].monthlyDetermineSalaryIndexate) / 3;

    
    let lastTwelthSum = 0;
    if(salariesSums.length >= 12){
        for(let i=1; i<=12; i++){
            lastTwelthSum += salariesSums[salariesSums.length - i].monthlyDetermineSalaryIndexate
        }
    }
    const lastTwelthAvg = lastTwelthSum / 12;


    let lastFormerTwelthSum = 0;
    if(salariesSums.length >= 24){
        for(let i=13; i<=24; i++){
            lastFormerTwelthSum += salariesSums[salariesSums.length - i].monthlyDetermineSalaryIndexate
        }
    }
    const lastFormerTwelthAvg = lastFormerTwelthSum / 12;

    return Math.max(lastThreeAvg, lastTwelthAvg, lastFormerTwelthAvg).toLocaleString(undefined,{ minimumFractionDigits: 2 });
}

module.exports = CalculateSalaryDetermine;