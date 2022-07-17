const bcrypt = require('bcrypt');

const pool = require('./initialize');

module.exports = {
    create: async (req, res) => {
        const {
            name,
            ui_order,
            project_id
        } = req?.body || {};

        try {
            const dbResponse = await pool.query(
                'insert into task_sections (name, ui_order, project_id) values($1, $2, $3) returning *',
                [name, ui_order, project_id]
            );
            res.status(200).json({
                ...(dbResponse?.rows?.[0]),
                tasks: []
            });
        } catch (e) {
            console.log('error: ', e);
            res.status(500).json('Error creating task_section');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_sections where id = $1 ORDER BY ui_order ASC',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading task_section');
        }
    },
    readAll: async (req, res) => {
        const {
            project_id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_sections where project_id = $1 ORDER BY ui_order ASC',
                [project_id]
            );
            res.status(200).json(dbResponse?.rows);
        } catch (e) {
            res.status(500).json('Error reading task_section');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from task_sections where id = $1',
                [id]
            );
            const {
                name,
                ui_order,
                project_id,
                timestamp
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };
            const dbUpdateResponse = await pool.query(
                'update task_sections set name = $1, ui_order = $2, project_id = $3, timestamp = $4 where id = $5 returning *',
                [name, ui_order, project_id, timestamp, id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating task_section');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from task_sections where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            console.log(e);
            res.status(500).json('Error deleting task_section');
        }
    }
}
