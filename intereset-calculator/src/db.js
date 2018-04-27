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
        try{
            const res = await client.query('SELECT "DAY_INTEREST" as interest from daily_interest where "DATE" = $1', [date]);
            return res.rows[0].interest;
        }catch(e){
            console.error(e.message);
        }
    },

    async getInterests (client) {
        try{
            const res = await client.query('SELECT "DAY_INTEREST" as interest, "DATE" as date from daily_interest ORDER BY "DATE"');
            return res.rows;
        } catch(err) {
            console.error(err.message);
        }
    },

    async getMadadByDate (client, date) {
        try{
            const res = await client.query('SELECT "INDEX_1951" as index from consumer_price_index where "DATE" = $1', [date]);
            return res.rows[0].index;
        } catch(err) {
            console.error(err.message);
        }
    }
};

export default db;