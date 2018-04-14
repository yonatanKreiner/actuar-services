import { Client } from 'pg';

const db = {
    async connect () {
        const client = new Client( {
            user: 'sspikicaygiiyh',
            host: 'ec2-54-247-95-125.eu-west-1.compute.amazonaws.com',
            database: 'd7mnao3pktcvtg',
            password: 'b606c3bf8701db577f60986b49950494042d7c44091c77bd74b4c9ac33b5a085',
            port: 5432,
            ssl: true
        });

        await client.connect();
        return client;
    },

    async disconnect (client) {
        await client.end();
    },

    async getInterestByDate (client, date) {
        const res = await client.query('SELECT day_interest as interest from daily_interest where date = $1', [date]);
        return map(row => { row.interest }, res.rows);
    },

    async getMadadByDate (client, date) {
        const res = await client.query('SELECT index_1951 as interest from consumer_price_index where date = $1', [date]);
        return map(row => { row.interest }, res.rows);
    }
};

export default db;