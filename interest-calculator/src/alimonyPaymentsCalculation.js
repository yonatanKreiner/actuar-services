const moment = require('moment');
const {getIndexate} = require('./madad');


const calculateAlimonyPayments = async (children, madadIndexateInterval, startPaymentDate) => {
    const startdatePayment = new Date(startPaymentDate); 
 
    const doneCalcChildrenPayments = children.map(child => false);
    const isFirstMonthAfter18 =  children.map(child => true);

    let cureentPaymentDate = new Date(startPaymentDate);
    const monthlyPayments = [];
    

    while(doneCalcChildrenPayments.some(x => x === false)){
        const childrenMonthPayment = await children.map(async (child, index) => {
            const childAge = getAge(moment(child.birthDate, 'DD/MM/YYYY').toDate(), cureentPaymentDate);
            if(childAge < 18){
                let childPaymentSum = parseInt(child.sum);

                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate, index);

                return childPaymentSum;
            }else if((child.gender === "male" && childAge<21) ||
                     (child.gender === "female" && childAge<20)){
                let childPaymentSum = parseInt(child.sum) * parseFloat(child.adultPrecent);
                
                childPaymentSum = await indexateMadad(monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate, index, isFirstMonthAfter18[index]);
                
                isFirstMonthAfter18[index] = false;
                
                return childPaymentSum;
            }else{
                doneCalcChildrenPayments[index] = true;
                return 0;
            }
        });

        const monthPayments = (await Promise.all(childrenMonthPayment));
                                //.reduce((total, childPayment) => childPayment + total, 0);

        monthlyPayments.push({date: moment(cureentPaymentDate).format("MM-YYYY"), payments: monthPayments});
        cureentPaymentDate = new Date(cureentPaymentDate.setMonth(cureentPaymentDate.getMonth()+1));
    }

    const totalMonthlyPayments = monthlyPayments.map(({date, payments}) => 
                                        ({date, payment: payments.reduce((total,payment) => total + payment, 0)}));

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

const indexateMadad = async (monthlyPayments, childPaymentSum, madadIndexateInterval, startdatePayment, cureentPaymentDate, childIndex, isFirstMonthAfter18 = false) => {
    if((monthlyPayments.length+1) % madadIndexateInterval == 0 && monthlyPayments.length > 0){
        childPaymentSum = ((await getIndexate(childPaymentSum, startdatePayment, cureentPaymentDate))+ childPaymentSum);
    }else if(monthlyPayments.length > 0 && !isFirstMonthAfter18){
        childPaymentSum = monthlyPayments[monthlyPayments.length - 1].payments[childIndex];
    }

    return childPaymentSum;
}

module.exports = calculateAlimonyPayments;