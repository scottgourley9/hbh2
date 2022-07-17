const bcrypt = require('bcrypt');

const pool = require('./initialize');

module.exports = {
    create: async (req, res) => {
        const {
            name,
            description,
            date,
            time,
            project_id
        } = req?.body || {};

        try {
            const dbResponse = await pool.query(
                'insert into milestones (name, description, date, time, project_id) values($1, $2, $3, $4, $5) returning *',
                [name, description, date, time, project_id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error creating milestone');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from milestones where id = $1',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading milestone');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from milestones where id = $1',
                [id]
            );
            const {
                name,
                description,
                date,
                time,
                project_id
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };

            const dbUpdateResponse = await pool.query(
                'update milestones set name = $1, description = $2, date = $3, time = $4, project_id = $5 where id = $6 returning *',
                [name, description, date, time, project_id, id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating milestone');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dpResponse = await pool.query(
                'delete from milestones where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting milestone');
        }
    }
}
