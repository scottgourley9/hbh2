const bcrypt = require('bcrypt');

const pool = require('./initialize');

const mediaApi = require('./media');

module.exports = {
    create: async (req, res) => {
        let {
            name,
            amount,
            category,
            color,
            receipt_image_url,
            ui_order,
            project_id,
            imageObject
        } = req?.body || {};

        try {
            if (imageObject) {
                receipt_image_url = await mediaApi?.create(imageObject) || '';
            }
        } catch (e) {
            console.error(e);
        }

        try {
            const dbResponse = await pool.query(
                'insert into expenses (name, amount, category, color, receipt_image_url, ui_order, project_id) values($1, $2, $3, $4, $5, $6, $7) returning *',
                [name, amount, category, color, receipt_image_url, ui_order, project_id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error creating expense');
        }
    },
    readAll: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from expenses where project_id = $1 ORDER BY timestamp ASC',
                [id]
            );

            res.status(200).json(dbResponse?.rows);
        } catch (e) {
            res.status(500).json('Error reading expenses');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from expenses where id = $1',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading expense');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from expenses where id = $1',
                [id]
            );
            let {
                name,
                amount,
                category,
                color,
                receipt_image_url,
                ui_order,
                project_id,
                imageObject
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };

            try {
                if (imageObject) {
                    receipt_image_url = await mediaApi?.create(imageObject) || '';
                }
            } catch (e) {
                console.error(e);
            }

            const dbUpdateResponse = await pool.query(
                'update expenses set name = $1, amount = $2, category = $3, color = $4, receipt_image_url = $5, ui_order = $6, project_id = $7, timestamp = $8 where id = $9 returning *',
                [name, amount, category, color, receipt_image_url, ui_order, project_id, new Date(), id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating expense');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from expenses where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting expense');
        }
    }
}
