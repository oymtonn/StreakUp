import { pool } from '../config/database.js';

// Helper function to update parent task progress based on subtasks
const updateParentTaskProgress = async (parentTaskId) => {
    try {
        const subtasksResult = await pool.query(
            `SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE completed = true) as completed 
             FROM tasks WHERE parent_task_id = $1`,
            [parentTaskId]
        );

        const { total, completed } = subtasksResult.rows[0];
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        await pool.query(
            `UPDATE tasks SET progress = $1, completed = $2 WHERE id = $3`,
            [progress, progress === 100, parentTaskId]
        );
    } catch (err) {
        console.error('Error updating parent task progress:', err);
    }
};

export const getTasks = async (req, res) => {
    let results;

    try {
        // If user is authenticated, filter by user_id and exclude subtasks
        if (req.user && req.user.id) {
            results = await pool.query(
                `SELECT * FROM tasks WHERE user_id = $1 AND (is_subtask = false OR is_subtask IS NULL) ORDER BY id ASC`,
                [req.user.id]
            );
        } else {
            results = await pool.query(`SELECT * FROM tasks WHERE (is_subtask = false OR is_subtask IS NULL) ORDER BY id ASC`);
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

export const getSubtasks = async (req, res) => {
    const { id } = req.params;

    try {
        let result;
        if (req.user && req.user.id) {
            result = await pool.query(
                `SELECT * FROM tasks WHERE parent_task_id = $1 AND user_id = $2 ORDER BY id ASC`,
                [id, req.user.id]
            );
        } else {
            result = await pool.query(
                `SELECT * FROM tasks WHERE parent_task_id = $1 ORDER BY id ASC`,
                [id]
            );
        }

        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(`Error fetching subtasks for task ${id}`, err);
        res.status(500).json({ error: 'Failed to fetch subtasks' });
    }
}

export const createTask = async (req, res) => {
    const { title, priority, tag, completed, progress, due_date, parent_task_id, is_subtask } = req.body;

    // Use authenticated user's ID
    const user_id = req.user ? req.user.id : req.body.user_id;

    console.log('Creating task:', {
        user_id,
        title,
        parent_task_id,
        is_subtask
    });

    try {
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, priority, tag, completed, progress, due_date, parent_task_id, is_subtask) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user_id, title, priority, tag, completed || false, progress || 0, due_date, parent_task_id || null, is_subtask || false]
        );

        console.log('Task created with ID:', result.rows[0].id, 'parent_task_id:', result.rows[0].parent_task_id);

        // If this is a subtask, update parent task progress
        if (parent_task_id) {
            console.log('Updating parent task progress for:', parent_task_id);
            await updateParentTaskProgress(parent_task_id);
        }

        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error creating task', err);
        res.status(500).json({ error: 'Failed to create task', details: err.message });
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        // Get task info before deleting to check if it has a parent
        let taskInfo;
        if (req.user && req.user.id) {
            taskInfo = await pool.query(
                `SELECT parent_task_id FROM tasks WHERE id = $1 AND user_id = $2`,
                [id, req.user.id]
            );
        } else {
            taskInfo = await pool.query(`SELECT parent_task_id FROM tasks WHERE id = $1`, [id]);
        }

        const parentTaskId = taskInfo.rows[0]?.parent_task_id;

        // Delete the task
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

        // If this was a subtask, update parent progress
        if (parentTaskId) {
            await updateParentTaskProgress(parentTaskId);
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
        // Get current task info to check if it's a subtask
        let currentTask;
        if (req.user && req.user.id) {
            currentTask = await pool.query(
                `SELECT parent_task_id FROM tasks WHERE id = $1 AND user_id = $2`,
                [id, req.user.id]
            );
        } else {
            currentTask = await pool.query(`SELECT parent_task_id FROM tasks WHERE id = $1`, [id]);
        }

        const parentTaskId = currentTask.rows[0]?.parent_task_id;

        // Update the task
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

        // If this is a subtask, update parent progress
        if (parentTaskId) {
            await updateParentTaskProgress(parentTaskId);
        }

        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(`Error modifying task with id ${id}`, err);
        res.status(500).json({ error: 'Failed to modify task' });
    }
}
