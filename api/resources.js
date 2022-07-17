const bcrypt = require('bcrypt');

const pool = require('./initialize');

module.exports = {
    create: async (req, res) => {
        const {
            link,
            name,
            description
        } = req?.body || {};

        try {
            const dbResponse = await pool.query(
                'insert into resources (link, name, description) values($1, $2, $3) returning *',
                [link, name, description]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error creating resource');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from resources where id = $1',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading resource');
        }
    },
    readAll: async (req, res) => {
        try {
            const dbResponse = await pool.query(
                'select * from resources'
            );

            res.status(200).json(dbResponse?.rows);
        } catch (e) {
            res.status(500).json('Error reading resources');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from resources where id = $1',
                [id]
            );
            const {
                link,
                name,
                description
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };
            const dbUpdateResponse = await pool.query(
                'update resources set link = $1, name = $2, description = $3, timestamp = $4 where id = $5 returning *',
                [link, name, description, new Date(), id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating resource');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from resources where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting resource');
        }
    }
}
