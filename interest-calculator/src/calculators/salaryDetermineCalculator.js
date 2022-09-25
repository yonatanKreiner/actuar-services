const {getIndexate} = require('../tools/madad'); 

const independentWorkerSalaryPrec = 0.16;
const workerSalaryPrec = 0.125;

const CalculateSalaryDetermine = async (salaries, calculationDate, isIndependendWorker) => {
    const salariesSumsPromise = salaries.map(async salary => {
        const totalReturn = parseFloat(salary.sumEmployee) + parseFloat(salary.sumCompany);
        let returnPrecOfSalary = totalReturn / parseFloat(salary.sum); 
        if(!salary.isIndependendWorker && returnPrecOfSalary < workerSalaryPrec){
            returnPrecOfSalary = workerSalaryPrec;
        }else if(salary.isIndependendWorker && returnPrecOfSalary < independentWorkerSalaryPrec){
            returnPrecOfSalary = independentWorkerSalaryPrec;
        }

        const monthlyDetermineSalary = totalReturn / returnPrecOfSalary;

        const indexateStartDate = new Date(salary.date);
        indexateStartDate.setMonth(-2);
        const monthlyDetermineSalaryIndexate = await getIndexate(monthlyDetermineSalary, indexateStartDate, new Date(calculationDate));
     
        return ({
            date: salary.date,
            sum: salary.sum,
            isIndependendWorker: salary.isIndependendWorker,
            sumEmployee: salary.sumEmployee,
            sumCompany: salary.sumCompany,
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

    const determineSalary = Math.max(lastThreeAvg, lastTwelthAvg, lastFormerTwelthAvg).toLocaleString(undefined,{ minimumFractionDigits: 2 });
    return {determineSalary, salariesSums};
}

module.exports = CalculateSalaryDetermine;