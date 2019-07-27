const xlsx = require('node-xlsx');

const getExcel = () => {
    const path = './assets/actuar.xlsx';
    return xlsx.parse(path);
}

const sheets = {
    work: 2,
    yearlyInterests: 3,
    madadsAndInterests: 4,
    dailyInterests: 5,
}

const columns = {
    madad: 1,
    interest: 7
}

const firstMadad = {
    date: new Date(1942, 0, 1),
    row: 2
}

const getMadadRow = date => {
    let months = (date.getFullYear() - firstMadad.date.getFullYear()) * 12;
    months -= firstMadad.date.getMonth();
    months += date.getMonth();
    return months + firstMadad.row;
}

const getMadadByDate = date => {
    const worksheet = excel[sheets.madadsAndInterests]
    const row = getMadadRow(date);
    return worksheet.data[row][columns.madad];
}

const firstInterest = {
    date: new Date(1990, 0, 1),
    row: 8
}

const getInterestRow = date => {
    const daysDifference = Math.round((date - firstInterest.date) / (1000 * 60 * 60 * 24));
    return daysDifference + firstInterest.row;
}

const getInterestByDate = date => {
    const worksheet = excel[sheets.work]
    const row = getInterestRow(date);
    return worksheet.data[row][columns.interest];
}

const excel = getExcel();

module.exports = { getMadadByDate, getInterestByDate }