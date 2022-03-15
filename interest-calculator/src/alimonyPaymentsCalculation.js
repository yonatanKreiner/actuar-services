const moment = require('moment');
const {getIndexate} = require('./madad');


const calculateAlimonyPayments = async (children, madadIndexateInterval, startPaymentDate, endPaymentDate, baseIndexateDate, paymentDayInMonth) => {
    const startdatePayment = new Date(startPaymentDate);
    const enddatePayment = new Date(endPaymentDate);
    const baseindexateDate = new Date(baseIndexateDate);
 
    const doneCalcChildrenPayments = children.map(child => false);
    const isFirstMonthAfter18 =  children.map(child => true);

    let cureentPaymentDate = new Date(startPaymentDate);
    cureentPaymentDate.setDate(1);
    const monthlyPayments = [];
    

    while(doneCalcChildrenPayments.some(x => x === false) && cureentPaymentDate <= enddatePayment){
        const childrenMonthPayment = await children.map(async (child, index) => {
            const childAge = getAge(new Date(child.birthDate), cureentPaymentDate);
            if(childAge < 18){
                let childPaymentSum = parseInt(child.sum);

                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, baseindexateDate, cureentPaymentDate, index, paymentDayInMonth);
                childPaymentSum = getMonthPaymentWithFractionInNeeded(startdatePayment, enddatePayment, cureentPaymentDate, childPaymentSum, parseInt(child.sum));

                return childPaymentSum;
            }else if((child.gender === "male" && childAge<21) ||
                     (child.gender === "female" && childAge<20)){
                let childPaymentSum = parseInt(child.sum) * parseFloat(child.adultPrecent);
                
                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, baseindexateDate, cureentPaymentDate, index, paymentDayInMonth, isFirstMonthAfter18[index]);
                childPaymentSum = getMonthPaymentWithFractionInNeeded(startdatePayment, enddatePayment, cureentPaymentDate, childPaymentSum, parseInt(child.sum)*parseFloat(child.adultPrecent));

                isFirstMonthAfter18[index] = false;
                
                return childPaymentSum;
            }else{
                doneCalcChildrenPayments[index] = true;
                return 0;
            }
        });

        const monthPayments = (await Promise.all(childrenMonthPayment));

        monthlyPayments.push({date: moment(cureentPaymentDate).format("MM-YYYY"), payments: monthPayments});
        cureentPaymentDate = new Date(cureentPaymentDate.setMonth(cureentPaymentDate.getMonth()+1));
    }

    const totalMonthlyPayments = monthlyPayments.map(({date, payments}) => 
                                        ({date, childrenPayments: payments, totalPayment: payments.reduce((total,payment) => parseInt(total + payment), 0)}));

    return totalMonthlyPayments;
}

const getAge = (birthDate, paymentDate) => {
    var age = paymentDate.getFullYear() - birthDate.getFullYear();
    var m = paymentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && paymentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const indexateMadad = async (monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate, childIndex, paymentDayInMonth, isFirstMonthAfter18 = false) => {
    if(monthlyPayments.length > 0 && (monthlyPayments.length) % madadIndexateInterval == 0){
        let indexateCalcEndDate = new Date(cureentPaymentDate);
        indexateCalcEndDate.setMonth(paymentDayInMonth >= 15 ? indexateCalcEndDate.getMonth()-1 : indexateCalcEndDate.getMonth()-2)
        indexateCalcEndDate = new Date(indexateCalcEndDate.getFullYear(),indexateCalcEndDate.getMonth()+1,0); // set to last day of month
        childPaymentSum = ((await getIndexate(childPaymentSum, startdatePayment, indexateCalcEndDate))+ childPaymentSum);
    }else if(monthlyPayments.length > 0 && !isFirstMonthAfter18){
        childPaymentSum = monthlyPayments[monthlyPayments.length - 1].payments[childIndex];
    }

    return childPaymentSum;
}

const getFractionPaymentFromMonthFromTheEnd = (date, paymentSum) => {
    // using 0 as the day it will give us the last day of the prior month.
    const daysInMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    return paymentSum * ((daysInMonth - (date.getDate()-1)) / daysInMonth);
}

const getFractionPaymentFromMonthFromStart = (date, paymentSum) => {
    // using 0 as the day it will give us the last day of the prior month.
    const daysInMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    return paymentSum * (date.getDate() / daysInMonth);
}

const getMonthPaymentWithFractionInNeeded = (startDate, endDate, currentDate, paymentSum, initialPament) => {
    const secondMonth = new Date(startDate);
    secondMonth.setMonth(secondMonth.getMonth()+1);
    // is first or last payment
    if(startDate.getMonth() == currentDate.getMonth() && startDate.getFullYear() == currentDate.getFullYear()){
        return getFractionPaymentFromMonthFromTheEnd(startDate, paymentSum);
    } else if(endDate.getMonth() == currentDate.getMonth() && endDate.getFullYear() == currentDate.getFullYear()){
        return getFractionPaymentFromMonthFromStart(endDate, paymentSum);
    }else if(secondMonth.getMonth() == currentDate.getMonth() && secondMonth.getFullYear() == currentDate.getFullYear()){
        // for second month to not based on fraction month
        return initialPament;
    }
    else {
        return paymentSum;
    }
}

module.exports = calculateAlimonyPayments;