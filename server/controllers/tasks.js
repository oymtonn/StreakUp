import { pool } from '../config/database.js';

export const getTasks = async (req, res) => {
    let results;

    try {
        // If user is authenticated, filter by user_id
        if (req.user && req.user.id) {
            results = await pool.query(
                `SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC`,
                [req.user.id]
            );
        } else {
            results = await pool.query(`SELECT * FROM tasks ORDER BY id ASC`);
        }
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
        // If user is authenticated, ensure they own this task
        if (req.user && req.user.id) {
            result = await pool.query(
                `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
                [id, req.user.id]
            );
        } else {
            result = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
        }
        
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.status(200).json(result.rows[0])
    }
    catch (err) {
        console.error(`Error fetching task with task id ${id}`, err)
        res.status(500).json({ error: 'Failed to fetch task' })
    }
}

export const createTask = async (req, res) => {
    const { title, priority, tag, completed, progress, due_date } = req.body;
    
    // Use authenticated user's ID
    const user_id = req.user ? req.user.id : req.body.user_id;

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
        // If user is authenticated, ensure they own this task
        let result;
        if (req.user && req.user.id) {
            result = await pool.query(
                `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
                [id, req.user.id]
            );
        } else {
            result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [id]);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
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
    const { title, priority, tag, completed, progress, due_date } = req.body;

    try {
        // If user is authenticated, ensure they own this task
        let result;
        if (req.user && req.user.id) {
            result = await pool.query(
                `UPDATE tasks 
                 SET title = $1, priority = $2, tag = $3, completed = $4, progress = $5, due_date = $6 
                 WHERE id = $7 AND user_id = $8 RETURNING *`,
                [title, priority, tag, completed, progress, due_date, id, req.user.id]
            );
        } else {
            result = await pool.query(
                `UPDATE tasks 
                 SET title = $1, priority = $2, tag = $3, completed = $4, progress = $5, due_date = $6 
                 WHERE id = $7 RETURNING *`,
                [title, priority, tag, completed, progress, due_date, id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }

        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(`Error modifying task with id ${id}`, err);
        res.status(500).json({ error: 'Failed to modify task' });
    }
}

