import { pool } from './database.js';
import habitData from '../data/habitData.js';

const createTables = async () => {

    try {
        await pool.query(`DROP TABLE IF EXISTS habits`);

        await pool.query(`
            CREATE TABLE habits(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(10) NOT NULL,
                title VARCHAR(255) NOT NULL,
                frequency VARCHAR(10) NOT NULL,
                streak VARCHAR(10) NOT NULL,
                last_completed_date DATE NOT NULL
            )
            `);
    }

    catch (err) {
        console.log(err);
    }

}

const seedHabitTable = async () => {
    for (const habit of habitData) {
        await pool.query(
            `INSERT INTO habits (id, user_id, title, frequency, streak, last_completed_date)
             VALUES ($1, $2, $3, $4, $5, $6)`,
             [
                habit.id,
                habit.user_id,
                habit.title,
                habit.frequency,
                habit.streak,
                habit.last_completed_date
             ]
        );
        console.log(`${habit.title} added`);
    }
}

const resetDatabase = async () => {
    await createTables();
    await seedHabitTable();

    console.log('Database reset');
    await pool.end();
};

resetDatabase();