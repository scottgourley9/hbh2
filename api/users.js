const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');
const pool = require('./initialize');

const users = {
    create: async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            password
        } = req?.body || {};

        const query = async ps => {
            try {
                const dbResponse = await pool.query(
                    'insert into users (first_name, last_name, email, ps) values($1, $2, $3, $4) returning *',
                    [firstName, lastName, email, ps]
                );
                const user = dbResponse?.rows?.[0] || {};

                jwt.sign({ userId: user?.id }, config.privateTokenKey, { expiresIn: 1000 * 60 * 60 * 24 * 30 }, (err, token) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json('Error creating auth token');
                    } else {
                        res.status(200).json({ user, token });
                    }
                });
            } catch (e) {
                console.log(e);
                res.status(500).json('Error creating user');
            }
        }

        if (password) {
            bcrypt.hash(password, config?.saltRounds, (err, hash) => {
                if (err) {
                    console.log(e);
                    res.status(500).json('Error hashing password');
                } else {
                    query(hash);
                }
            });
        } else {
            query(null);
        }
    },
    read: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select * from users where id = $1',
                [id]
            );
            res.status(200).json(dbResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error reading user');
        }
    },
    update: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbReadResponse = await pool.query(
                'select * from users where id = $1',
                [id]
            );
            const {
                first_name,
                last_name,
                email,
                ps
            } = {
                ...(dbReadResponse?.rows?.[0] || {}),
                ...(req.body || {})
            };
            const dbUpdateResponse = await pool.query(
                'update users set first_name = $1, last_name = $2, email = $3, ps = $4, timestamp = $5 where id = $6 returning *',
                [first_name, last_name, email, ps, new Date(), id]
            );
            res.status(200).json(dbUpdateResponse?.rows?.[0]);
        } catch (e) {
            res.status(500).json('Error updating user');
        }
    },
    delete: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'delete from users where id = $1',
                [id]
            );
            res.status(200).json('deleted');
        } catch (e) {
            res.status(500).json('Error deleting user');
        }
    },
    verifyToken: async (req, res) => {
        const {
            userId,
            token
        } = req?.body || {};

        jwt.verify(token, config?.privateTokenKey, (err, decoded) => {
            if (err) {
                res.status(500).json('Invalid token');
            } else if (userId && decoded?.userId === userId) {
                jwt.sign({ userId }, config.privateTokenKey, { expiresIn: 1000 * 60 * 60 * 24 * 30 }, (err, token) => {
                    if (err) {
                        res.status(500).json('Error creating auth token');
                    } else {
                        res.status(200).json({ token });
                    }
                });
            } else {
                res.status(500).json('Invalid token');
            }
        });
    },
    signIn: async (req, res) => {
        const {
            email,
            password
        } = req?.body || {};

        let lowerCaseEmail = (email || '').toLowerCase();

        try {
            const dbResponse = await pool.query(
                'select * from users where email = $1',
                [lowerCaseEmail]
            );

            const user = dbResponse?.rows?.[0] || {};
            const verified = bcrypt.compareSync(password, user?.ps);

            if (verified) {
                jwt.sign({ userId: user?.id }, config.privateTokenKey, { expiresIn: 1000 * 60 * 60 * 24 * 30 }, (err, token) => {
                    if (err) {
                        res.status(500).json('Error creating auth token');
                    } else {
                        res.status(200).json({ user: user || {}, token });
                    }
                });
            } else {
                res.status(500).json('Not verified');
            }
        } catch (e) {
            console.log('wtfffff: ', e.message);
            res.status(500).json('Error signing in');
        }
    },
    updatePinnedResources: async (req, res) => {
        const {
            id
        } = req?.params || {};

        const {
            pinned_resources
        } = req?.body || {};

        try {
            const dbResponse = await pool.query(
                'update users set pinned_resources = $1 where id = $2 returning *',
                [pinned_resources, id]
            );

            const user = dbResponse?.rows?.[0] || {};

            res.status(200).json(user);
        } catch (e) {
            res.status(500).json('Error updating pinned resources');
        }
    },
    pinnedResouces: async (req, res) => {
        const {
            id
        } = req?.params || {};

        try {
            const dbResponse = await pool.query(
                'select pinned_resources from users where id = $1',
                [id]
            );

            const pinnedResouces = dbResponse?.rows?.[0] || {};

            res.status(200).json(pinnedResouces);
        } catch (e) {
            res.status(500).json('Error getting pinned resources');
        }
    }
}

module.exports = users;
