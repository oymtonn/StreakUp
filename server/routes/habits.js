import { getHabits } from '../controllers/habits.js';
import express from 'express';

const router = express.Router();

router.get('/', getHabits);

export default router;