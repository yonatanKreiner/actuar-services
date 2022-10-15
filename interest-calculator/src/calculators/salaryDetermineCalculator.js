const {getIndexate} = require('../tools/madad'); 

const independentWorkerSalaryPrec = 0.16;
const workerSalaryPrec = 0.125;

const CalculateSalaryDetermine = async (salaries, calculationDate) => {
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
        indexateStartDate.setHours(0);indexateStartDate.setMinutes(0);indexateStartDate.setSeconds(0);indexateStartDate.setMilliseconds(0);
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

    const salariesSums = await Promise.all(salariesSumsPromise);

    const noDupSalariesCalc = []; 
    for (let i = 0; i < salariesSums.length; i++) {
        if (i + 1 < salariesSums.length && salariesSums[i].date === salariesSums[i + 1].date) {
            const salaryCalc = salariesSums[i]; 
            salaryCalc.sum += salariesSums[i + 1].sum;
            salaryCalc.sumEmployee += salariesSums[i + 1].sumEmployee;
            salaryCalc.sumCompany += salariesSums[i + 1].sumCompany;
            salaryCalc.totalReturn += salariesSums[i + 1].totalReturn;
            salaryCalc.returnPrecOfSalary += salariesSums[i + 1].returnPrecOfSalary;
            salaryCalc.monthlyDetermineSalary += salariesSums[i + 1].monthlyDetermineSalary;
            salaryCalc.monthlyDetermineSalaryIndexate += salariesSums[i + 1].monthlyDetermineSalaryIndexate;
            i++;
            noDupSalariesCalc.push(salaryCalc);
        }else{
            noDupSalariesCalc.push(salariesSums[i]);
        }
    }

    const lastThreeAvg = (noDupSalariesCalc[noDupSalariesCalc.length - 1].monthlyDetermineSalaryIndexate +
                            noDupSalariesCalc[noDupSalariesCalc.length - 2].monthlyDetermineSalaryIndexate +
                            noDupSalariesCalc[noDupSalariesCalc.length - 3].monthlyDetermineSalaryIndexate) / 3;

    
    let lastTwelthSum = 0;
    let i = 0;
    if(noDupSalariesCalc.length >= 4){
        for(i=0; i < noDupSalariesCalc.length && i < 12; i++){
            lastTwelthSum += noDupSalariesCalc[i].monthlyDetermineSalaryIndexate
        }
    }
    const lastTwelthAvg = lastTwelthSum / (i);


    let lastFormerTwelthSum = 0;
    i = 13;
    if(noDupSalariesCalc.length >= 13){
        for(i=13; i < noDupSalariesCalc.length && i<24; i++){
            lastFormerTwelthSum += noDupSalariesCalc[i].monthlyDetermineSalaryIndexate
        }
    }
    const lastFormerTwelthAvg = lastFormerTwelthSum / (i - 12);

    const determineSalary = Math.max(lastThreeAvg, lastTwelthAvg, lastFormerTwelthAvg).toLocaleString(undefined,{ minimumFractionDigits: 2 });
    return {determineSalary, salariesSums, calcResults: {lastThreeAvg, lastTwelthAvg, lastFormerTwelthAvg}};
}

module.exports = CalculateSalaryDetermine;