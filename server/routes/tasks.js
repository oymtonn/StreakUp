import { createTask, getTaskById, getTasks, deleteTask, modifyTask } from "../controllers/tasks.js";
import express from 'express';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', modifyTask);
router.delete('/:id', deleteTask);

export default router;
