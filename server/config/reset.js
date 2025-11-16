import { pool } from './database.js';
import habitData from '../data/habitData.js';
import taskData from '../data/taskData.js';

const createTables = async () => {

    try {
        await pool.query(`DROP TABLE IF EXISTS habits`);

        await pool.query(`
            CREATE TABLE habits(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(10) NOT NULL,
                title VARCHAR(255) NOT NULL,
                priority VARCHAR(10) NOT NULL,
                tag VARCHAR(10),
                streak VARCHAR(10) NOT NULL,
                last_completed_date DATE DEFAULT NULL
            )
            `);
        
        await pool.query(`DROP TABLE IF EXISTS tasks`);

        await pool.query(`
            CREATE TABLE tasks(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(10) NOT NULL,
                title VARCHAR(255) NOT NULL,
                priority VARCHAR(10) NOT NULL,
                tag VARCHAR(10),
                completed BOOLEAN NOT NULL DEFAULT FALSE,
                progress INTEGER NOT NULL DEFAULT 0,
                due_date TIMESTAMPTZ
            )
            `)
    }

    catch (err) {
        console.log(err);
    }

}

const seedHabitTable = async () => {
    for (const habit of habitData) {
        await pool.query(
            `INSERT INTO habits (id, user_id, title, priority, tag, streak, last_completed_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
             [
                habit.id,
                habit.user_id,
                habit.title,
                habit.priority,
                habit.tag,
                habit.streak,
                habit.last_completed_date
             ]
        );
        console.log(`${habit.title} added`);
    }
}

const seedTaskTable = async () => {
    for (const task of taskData) {
        await pool.query(
            `INSERT INTO tasks (user_id, title, priority, tag, completed, progress, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
             [
                task.user_id,
                task.title,
                task.priority,
                task.tag,
                task.completed,
                task.progress,
                task.due_date
             ]
            );
            console.log(`${task.title} added`)
    }

}

const resetDatabase = async () => {
    await createTables();
    await seedHabitTable();
    await seedTaskTable();

    console.log('Database reset');
    await pool.end();
};

resetDatabase();