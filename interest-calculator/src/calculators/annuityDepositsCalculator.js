const moment = require('moment');
const annuityRepo = require('../repos/annuity-repo');

const calculateAnnuities = async (deposits) => {
    const results = deposits.map(async deposit => {
        const yearlyAnnuity = await annuityRepo.getOne(deposit.year);

        if(!yearlyAnnuity){
            return {
                ...deposit
            }
        }

        const depositeFreeEmployee = deposit.depositeEmpoloyee - yearlyAnnuity.employeeMax > 0 ? deposit.depositeEmpoloyee - yearlyAnnuity.employeeMax : 0; 
        const depositeFreeCompany = deposit.depositeCompany - yearlyAnnuity.companyMax > 0 ? deposit.depositeCompany - yearlyAnnuity.companyMax : 0; 
        const depositeFreeCompensation = deposit.year >= 2017 && deposit.depositeCompensation - yearlyAnnuity.compensationMax > 0 ? deposit.depositeCompensation - yearlyAnnuity.compensationMax : 0; 
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