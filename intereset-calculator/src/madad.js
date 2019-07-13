const excel = require('./excel');

const indexate = (value, madadStart, madadEnd) => {
    return (madadEnd / madadStart * value - value);
}

const getMadadByDate = date => {
    const monthDeduction = date.getDate() < 15 ? 2 : 1;
    date.setMonth(date.getMonth() - monthDeduction)

    return getMadadByMonth(date);
};

const getMadadByMonth = date => {
    return excel.getMadadByDate(date)
};

module.exports =  {indexate, getMadadByDate};