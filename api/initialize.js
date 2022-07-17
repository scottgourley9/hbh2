const Pool = require('pg').Pool;
const config = require('../config');

const pool = new Pool({
    user: config?.pgUser,
    host: config?.pgHost,
    database: config?.pgDatabase,
    password: config?.pgPassword,
    port: config?.pgPort,
    ssl: config?.pgSsl,
    max: config?.pgMax,
    connectionTimeoutMillis: config?.pgConnectionTimeoutMillis,
    idleTimeoutMillis: config?.pgIdleTimeoutMillis
});

pool.on('error', (err, client) => {
    console.error('Unexpected db error', err);
});

module.exports = pool;
