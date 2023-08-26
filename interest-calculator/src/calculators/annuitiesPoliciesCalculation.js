const annuityRepo = require('../repos/annuity-repo');

const calculatePoliciesTable = async (policies) => {
    const sortedPolicies = policies.sort((a, b) => a.type == 'בסיסי' && b.type == 'רגילה' ?
        -1 : a.type == 'רגילה' && b.type == 'בסיסי' ? 1 :
            a.type == 'רגילה' && b.type == 'רגילה' ? a.order > b.order : 0);


    const resultsPolicies = [];

    for (let policyIndex in sortedPolicies) {
        const x = sortedPolicies[policyIndex];

        resultsPolicies.push({ name: x.name, id: x.id, type: x.type, order: x.order, deposits: [] });

        for (let d of x.deposits) {
            const yearlyAnnuity = await annuityRepo.getOne(d.year);
            if (x.type == 'בסיסי') {
                const notExemptEmpoloyee = d.depositeEmpoloyee;
                const exemptEmpoloyee = 0;
                const notExemptCompany = d.depositeCompany;
                const exemptCompany = 0;
                const notExemptCompensation = d.depositeCompensation;
                const exemptCompensation = 0;
                resultsPolicies[policyIndex].deposits.push({
                    year: d.year,
                    notExemptEmpoloyee:parseFloat(notExemptEmpoloyee),
                    exemptEmpoloyee:parseFloat(exemptEmpoloyee),
                    notExemptCompany:parseFloat(notExemptCompany),
                    exemptCompany:parseFloat(exemptCompany),
                    notExemptCompensation:parseFloat(notExemptCompensation),
                    exemptCompensation:parseFloat(exemptCompensation)
                });
            } else {
                const sumEmployee = resultsPolicies.reduce((sum, curr) =>
                    sum + curr.deposits.reduce((sum, dCurr) =>
                        dCurr.year == d.year ? sum + dCurr.notExemptEmpoloyee : sum, 0)
                    , 0);
                const sumCompany = resultsPolicies.reduce((sum, curr) =>
                    sum + curr.deposits.reduce((sum, dCurr) =>
                        dCurr.year == d.year ? sum + dCurr.notExemptCompany : sum, 0)
                    , 0);
                const sumCompensation = resultsPolicies.reduce((sum, curr) =>
                    sum + curr.deposits.reduce((sum, dCurr) =>
                        dCurr.year == d.year ? sum + dCurr.notExemptCompensation : sum, 0)
                    , 0);

                const notExemptEmpoloyee = yearlyAnnuity.employeeMax - sumEmployee > 0 ?
                    d.depositeEmpoloyee > (yearlyAnnuity.employeeMax - sumEmployee) ?
                        (yearlyAnnuity.employeeMax - sumEmployee) : d.depositeEmpoloyee
                    : 0;
                const exemptEmpoloyee = yearlyAnnuity.employeeMax - sumEmployee > 0 ?
                    d.depositeEmpoloyee > (yearlyAnnuity.employeeMax - sumEmployee) ?
                        d.depositeEmpoloyee - (yearlyAnnuity.employeeMax - sumEmployee) :
                        0
                    : d.depositeEmpoloyee;

                const notExemptCompany = yearlyAnnuity.companyMax - sumCompany > 0 ?
                    d.depositeCompany > (yearlyAnnuity.companyMax - sumCompany) ?
                        (yearlyAnnuity.companyMax - sumCompany) : d.depositeCompany
                    : 0;
                const exemptCompany = yearlyAnnuity.companyMax - sumCompany > 0 ?
                    d.depositeCompany > (yearlyAnnuity.companyMax - sumCompany) ?
                        d.depositeCompany - (yearlyAnnuity.companyMax - sumCompany) :
                        0
                    : d.depositeCompany;

                const notExemptCompensation = yearlyAnnuity.compensationMax - sumCompensation > 0 ?
                    d.depositeCompensation > (yearlyAnnuity.compensationMax - sumCompensation) ?
                        (yearlyAnnuity.compensationMax - sumCompensation) : d.depositeCompensation
                    : 0;
                const exemptCompensation = yearlyAnnuity.compensationMax - sumCompensation > 0 ?
                    d.depositeCompensation > (yearlyAnnuity.compensationMax - sumCompensation) ?
                        d.depositeCompensation - (yearlyAnnuity.compensationMax - sumCompensation) :
                        0
                    : d.depositeCompensation;

                resultsPolicies[policyIndex].deposits.push({
                    year: d.year,
                    notExemptEmpoloyee:parseFloat(notExemptEmpoloyee),
                    exemptEmpoloyee:parseFloat(exemptEmpoloyee),
                    notExemptCompany:parseFloat(notExemptCompany),
                    exemptCompany:parseFloat(exemptCompany),
                    notExemptCompensation:parseFloat(notExemptCompensation),
                    exemptCompensation:parseFloat(exemptCompensation)
                });
            }
        }
    }

    return resultsPolicies;
}

module.exports = { calculatePoliciesTable }