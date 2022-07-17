const bcrypt = require('bcrypt');

const pool = require('./initialize');

module.exports = {
    create: async (req, res) => {
        const {
            image_url,
            task_id
        } = req?.body || {};

        try {
            const dbResponse = await pool.query(
                'insert into task_photos (image_url, task_id) values($1, $2) returning *',
                [image_url, task_id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error creating task_photo');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_photos where id = $1',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading task_photo');
        }
    },
    readAll: async (req, res) => {
        const {
            task_id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_photos where task_id = $1',
                [task_id]
            );
            res.status(200).json(dbResponse?.rows);
        } catch (e) {
            res.status(500).json('Error reading task_photo');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from task_photos where id = $1',
                [id]
            );
            const {
                image_url,
                task_id
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };
            const dbUpdateResponse = await pool.query(
                'update task_photos set image_url = $1, task_id = $2 where id = $3 returning *',
                [image_url, task_id, id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating task_photo');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from task_photos where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting task_photo');
        }
    }
}
