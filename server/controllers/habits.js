import { pool } from '../config/database.js';

export const getHabits = async (req, res) => {
    let results;

    try {
        // If user is authenticated, filter by user_id
        if (req.user && req.user.id) {
            results = await pool.query(
                `SELECT * FROM habits WHERE user_id = $1 ORDER BY id ASC`,
                [req.user.id]
            );
        } else {
            results = await pool.query(`SELECT * FROM habits ORDER BY id ASC`);
        }
        res.status(200).json(results.rows);
    }
    catch (err){
        console.log('Error fetching habit data', err);
        res.status(500).json({ error: 'Failed fetch habits' });
    }
}

export const getHabitById = async (req, res) => {
    let results;
    const { id } = req.params;

    try {
        // If user is authenticated, ensure they own this habit
        if (req.user && req.user.id) {
            results = await pool.query(
                `SELECT * FROM habits WHERE id = $1 AND user_id = $2`,
                [id, req.user.id]
            );
        } else {
            results = await pool.query(`SELECT * FROM habits WHERE id = $1`, [id]);
        }
        
        if (!results.rows[0]) {
            return res.status(404).json({ error: 'Habit not found' });
        }
        
        res.status(200).json(results.rows[0]);
    }
    catch (err){
        console.log('Error fetching habit by id', err)
        res.status(500).json({ error: 'Failed fetch habit by id' });
    }
}

export const createHabit = async (req, res) => {
    const { title, priority, tag, streak, last_completed_date } = req.body;
    
    // Use authenticated user's ID
    const user_id = req.user ? req.user.id : req.body.user_id;

    try {
        const results = await pool.query(
            `INSERT INTO habits (user_id, title, priority, tag, streak, last_completed_date) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, title, priority, tag, streak, last_completed_date]
        );
        res.status(201).json(results.rows[0]);
    }
    catch (err) {
        console.error('Error creating habit', err);
        res.status(500).json({ error: 'Failed to create habit' });
    }
}

export const editHabit = async (req, res) => {
    const { id } = req.params;
    const { title, priority, tag, streak, last_completed_date } = req.body;

    try {
        // If user is authenticated, ensure they own this habit
        let results;
        if (req.user && req.user.id) {
            results = await pool.query(
                `UPDATE habits SET title = $1, priority = $2, tag = $3, streak = $4, last_completed_date = $5 
                 WHERE id = $6 AND user_id = $7 RETURNING *`,
                [title, priority, tag, streak, last_completed_date, id, req.user.id]
            );
        } else {
            results = await pool.query(
                `UPDATE habits SET title = $1, priority = $2, tag = $3, streak = $4, last_completed_date = $5 
                 WHERE id = $6 RETURNING *`,
                [title, priority, tag, streak, last_completed_date, id]
            );
        }
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found or unauthorized' });
        }
        
        res.status(200).json(results.rows[0]);
    }
    catch (err) {
        console.log('error updating habit', err)
        res.status(500).json({ error: 'Failed to edit habit' });
    }
}

export const deleteHabit = async (req, res) => {
    const { id } = req.params;
    try {
        // If user is authenticated, ensure they own this habit
        let results;
        if (req.user && req.user.id) {
            results = await pool.query(
                `DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *`,
                [id, req.user.id]
            );
        } else {
            results = await pool.query(`DELETE FROM habits WHERE id = $1 RETURNING *`, [id]);
        }
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found or unauthorized' });
        }
        
        res.status(200).json(results.rows[0]);
    }
    catch (err){
        console.log('error deleting habit', err)
        res.status(500).json({ error: 'Failed to delete habit' });
    }
}