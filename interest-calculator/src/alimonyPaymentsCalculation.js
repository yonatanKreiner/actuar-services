const moment = require('moment');
const {getIndexate} = require('./madad');


const calculateAlimonyPayments = async (children, madadIndexateInterval, startPaymentDate) => {
    const startdatePayment = new Date(startPaymentDate); 
 
    let doneCalcChildrenPayments = children.map(child => false);

    let cureentPaymentDate = new Date(startPaymentDate);
    const monthlyPayments = [];

    while(doneCalcChildrenPayments.some(x => x === false)){
        const monthPayment = await children.reduce(async (total,child, index) => {
            const childAge = getAge(moment(child.birthDate, 'DD/MM/YYYY').toDate(), cureentPaymentDate);
            if(childAge < 18){
                let childPaymentSum = child.sum;

                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate);

                return total + childPaymentSum;
            }else if((child.gender === "male" && childAge<21) ||
                     (child.gender === "female" && childAge<20)){
                let childPaymentSum = child.sum * child.adultPrecent;
                
                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate);

                return total + childPaymentSum;
            }else{
                doneCalcChildrenPayments[index] = true;
                return total + 0;
            }
        }, 0);

        monthlyPayments.push({date: moment(cureentPaymentDate).format("MM-YYYY"), payment: monthPayment});
        cureentPaymentDate = new Date(cureentPaymentDate.setMonth(cureentPaymentDate.getMonth()+1));
    }

    return monthlyPayments;
}

const getAge = (birthDate, paymentDate) => {
    var age = paymentDate.getFullYear() - birthDate.getFullYear();
    var m = paymentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && paymentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const indexateMadad = async (monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate) => {
    if((monthlyPayments.length+1) % madadIndexateInterval == 0 && monthlyPayments.length > 0){
        childPaymentSum = await getIndexate(childPaymentSum, startdatePayment, cureentPaymentDate) + childPaymentSum;
    }else if(monthlyPayments.length > 0){
        childPaymentSum = monthlyPayments[monthlyPayments.length - 1].payment;
    }

    return childPaymentSum;
}

module.exports = calculateAlimonyPayments;