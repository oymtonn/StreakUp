import { pool } from '../config/database.js';

export const getHabits = async () => {
    let results;

    try {
        results = await pool.query(`SELECT * FROM habits ORDER BY id ASC`);
    }
    catch (err){
        console.log('Error fetching habit data', err);
    }

    res.status(200).json(results.rows);
    
}