import db from './db';

import {indexate, getMadadByDate} from './madad';
import getInterestDifferences from './interest';
import {initializeAccumulativeInterests} from './interest';

const calculate = async (date, debts) => {
    const client = await db.connect();
    await initializeAccumulativeInterests({db, client});

    const finalDebt = (await Promise.all(debts
        .map(async debt => await addExtra({db, client}, date, debt))))
        .reduce((a, b) => a + b, 0);
    await db.disconnect(client);

    return finalDebt;
};

const addExtra = async (db, date, debt) => {
    const interestDifference = await getInterestDifferences(db, debt.date, debt.sum);

    const madadStart = await getMadadByDate(db, debt.date);
    const madadEnd = await getMadadByDate(db, date);
    
    const madadDifference = indexate(debt.sum, madadStart, madadEnd);
    const hazmadaRibit = indexate(interestDifference, madadStart, madadEnd);

    return debt.sum + madadDifference + interestDifference + hazmadaRibit;
};

export default calculate;