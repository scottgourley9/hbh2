const bcrypt = require('bcrypt');

const pool = require('./initialize');

const mediaApi = require('./media');

module.exports = {
    create: async (req, res) => {
        let {
            name = '',
            description = '',
            ui_order = null,
            checked = false,
            date,
            time,
            video = '',
            photo = '',
            section_id,
            imageObject,
            project_id,
            user_id,
            color
        } = req?.body || {};

        try {
            if (imageObject) {
                photo = await mediaApi?.create(imageObject) || '';
            }
        } catch (e) {
            console.error(e);
        }

        try {
            const dbResponse = await pool.query(
                'insert into task_items (name, description, ui_order, checked, date, time, video, photo, section_id, project_id, color, user_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *',
                [name, description, ui_order, checked, date, time, video, photo, section_id, project_id, color, user_id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            console.log('error: ', e?.message);

            res.status(500).json('Error creating task_item');
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_items where id = $1 ORDER BY ui_order ASC',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading task_item');
        }
    },
    readAll: async (req, res) => {
        const {
            project_id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from task_items where project_id = $1 ORDER BY ui_order ASC',
                [project_id]
            );
            res.status(200).json(dbResponse?.rows);
        } catch (e) {
            res.status(500).json('Error reading task_item');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from task_items where id = $1',
                [id]
            );
            let {
                name,
                description,
                ui_order,
                checked,
                date,
                time,
                video,
                photo,
                section_id,
                timestamp,
                imageObject,
                color
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };

            try {
                if (imageObject) {
                    photo = await mediaApi?.create(imageObject) || '';
                }
            } catch (e) {
                console.error(e);
            }

            const dbUpdateResponse = await pool.query(
                'update task_items set name = $1, description = $2, ui_order = $3, checked = $4, date = $5, time = $6, video = $7, photo = $8, section_id = $9, timestamp = $10, color = $11 where id = $12 returning *',
                [name, description, ui_order, checked, date, time, video, photo, section_id, new Date(), color, id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating task_item');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from task_items where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting task_item');
        }
    },
    upcomingTasks: async (req, res) => {
        const {
            user_id
        } = req?.params || {};
        const {
            interval
        } = req?.query || {};

        try {
            let queryString = "SELECT * FROM task_items WHERE user_id = $1 AND date <= NOW() + INTERVAL '7 days' ORDER BY date ASC, time ASC";

            if (interval && interval == 'none') {
                queryString = "SELECT * FROM task_items WHERE user_id = $1 ORDER BY date ASC, time ASC";
            } else if (interval && interval === '7') {
                queryString = "SELECT * FROM task_items WHERE user_id = $1 AND date <= NOW() + INTERVAL '7 days' ORDER BY date ASC, time ASC";
            } else if (interval && interval === '30') {
                queryString = "SELECT * FROM task_items WHERE user_id = $1 AND date <= NOW() + INTERVAL '30 days' ORDER BY date ASC, time ASC";
            }
            const dbResponse = await pool.query(
                queryString,
                [user_id]
            );

            res.status(200).json(dbResponse?.rows || []);
        } catch (e) {
            res.status(500).json('Error reading project');
        }
    }
}
