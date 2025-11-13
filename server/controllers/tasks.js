import { pool } from '../config/database.js';

export const getTasks = async (req, res) => {
    let results;

    try {
        results = await pool.query(`SELECT * FROM tasks ORDER BY id ASC`);
        res.status(200).json(results.rows);
    }
    catch (err) {
        console.log('Error fetching task data', err);
        res.status(500).json({ error: 'Failed to fetch task' })
    }
}

export const getTaskById = async (req, res) => {
    const { id } = req.params;
    let result;

    try {
        result = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id])
        res.status(200).json(result.rows[0])
    }
    catch (err) {
        console.error(`Error fetching task with task id ${id}`, err)
        res.status(500).json({ error: 'Failed to fetch task' })
    }
}

export const createTask = async (req, res) => {
    const { user_id, title, priority, tag, completed, progress, due_date } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, priority, tag, completed, progress, due_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, title, priority, tag, completed || false, progress || 0, due_date]
        );
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error creating task', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: result.rows[0] });
    }
    catch (err) {
        console.error(`Error deleting task with id ${id}`, err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
}

export const modifyTask = async (req, res) => {
    const { id } = req.params;
    const { user_id, title, priority, tag, completed, progress, due_date } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tasks 
             SET user_id = $1, title = $2, priority = $3, tag = $4, completed = $5, progress = $6, due_date = $7 
             WHERE id = $8 RETURNING *`,
            [user_id, title, priority, tag, completed, progress, due_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(`Error modifying task with id ${id}`, err);
        res.status(500).json({ error: 'Failed to modify task' });
    }
}

