import { pool } from '../config/database.js';

export const getHabits = async (req, res) => {
    let results;

    try {
        results = await pool.query(`SELECT * FROM habits ORDER BY id ASC`);
    }
    catch (err){
        console.log('Error fetching habit data', err);
        res.status(500).json({ error: 'Failed fetch habits' });
    }

    res.status(200).json(results.rows);
}

export const getHabitById = async (req, res) => {
    let results;
    const { id } = req.params;

    try {
        results = await pool.query(
            `SELECT * FROM habits WHERE id = $1`, [id]
        )
        res.status(200).json(results.rows[0]);
    }
    catch (err){
        console.log('Error fetching habit by id', err)
        res.status(500).json({ error: 'Failed fetch habit by id' });
    }
}

export const createHabit = async (req, res) => {
    const { user_id, title, priority, tag, streak, last_completed_date } = req.body;

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
    const { user_id, title, priority, tag, streak, last_completed_date } = req.body;

    try {
        const results = await pool.query(
            `
            UPDATE habits SET user_id = $1, title = $2, priority = $3, tag = $4, streak = $5, last_completed_date = $6 WHERE id = $7 RETURNING *
            `, [user_id, title, priority, tag, streak, last_completed_date, id]
        );
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
        const results = await pool.query(`DELETE FROM habits WHERE id = $1`, [id])
        res.status(200).json(results.rows[0]);
    }
    catch (err){
        console.log('error deleting habit', err)
        res.status(500).json({ error: 'Failed to delete habit' });
    }
    
}