const moment = require('moment');
const annuityRepo = require('../repos/annuity-repo');

const calculateAnnuities = async (deposits) => {
    const results = deposits.map(async deposit => {
        const depositeDate = moment(deposit.paymentMonth, "YYYYMM").toDate();
        const yearlyAnnuity = await annuityRepo.getOne(depositeDate.getFullYear());

        if(!yearlyAnnuity){
            return {
                ...deposit
            }
        }

        const employeeMax = yearlyAnnuity.avgSalary * 0.07;
        const companyMax = yearlyAnnuity.annuityFreeFromTax * 0.075;
        const compensationMax = yearlyAnnuity.maxCompensation * 0.0833;

        const depositeFreeEmployee = deposit.depositeEmpoloyee - employeeMax > 0 ? deposit.depositeEmpoloyee - employeeMax : 0; 
        const depositeFreeCompany = deposit.depositeCompany - companyMax > 0 ? deposit.depositeCompany - companyMax : 0; 
        const depositeFreeCompensation = deposit.depositeCompensation - compensationMax > 0 ? deposit.depositeCompensation - compensationMax : 0; 
        const total = depositeFreeEmployee + depositeFreeCompany + depositeFreeCompensation;

        return {
            ...deposit,
            depositeFreeEmployee,
            depositeFreeCompany,
            depositeFreeCompensation,
            total
        }
    });

    const resultPromise = Promise.all(results);
    return await resultPromise;
}

module.exports = {calculateAnnuities}