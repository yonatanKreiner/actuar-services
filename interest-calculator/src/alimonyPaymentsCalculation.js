const moment = require('moment');

const calculateAlimonyPayments = (children, madadIndexateInterval, startPaymentDate) => {
    let doneCalcChildrenPayments = children.map(child => false);

    let cureentPaymentDate = new Date(startPaymentDate);
    const monthlyPayments = [];

    while(doneCalcChildrenPayments.some(x => x === false)){
        const monthPayment = children.reduce((total,child, index) => {
            const childAge = getAge(moment(child.birthDate, 'DD/MM/YYYY').toDate(), cureentPaymentDate);
            if(childAge < 18){
                return total + child.sum;
            }else if((child.gender === "male" && childAge<21) ||
                     (child.gender === "female" && childAge<20)){
                return total + (child.sum * child.adultPrecent);
            }else{
                doneCalcChildrenPayments[index] = true;
                return total + 0;
            }
        }, 0);
        cureentPaymentDate = new Date(cureentPaymentDate.setMonth(cureentPaymentDate.getMonth()+1));
        monthlyPayments.push(monthPayment);
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


module.exports = calculateAlimonyPayments;