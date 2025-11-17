import { getHabits, getHabitById, createHabit, editHabit, deleteHabit } from '../controllers/habits.js';
import express from 'express';

const router = express.Router();

router.get('/', getHabits);
router.get('/:id', getHabitById);
router.post('/', createHabit);
router.put('/:id', editHabit);
router.delete('/:id', deleteHabit);


export default router;