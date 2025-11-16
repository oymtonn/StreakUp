import { getHabits, getHabitById, createHabit, editHabit, deleteHabit } from '../controllers/habits.js';
import express from 'express';

const router = express.Router();

router.get('/', getHabits);
router.get('/:id', getHabitById);
router.get('/', createHabit);
router.get('/:id', editHabit);
router.get('/:id', deleteHabit);


export default router;