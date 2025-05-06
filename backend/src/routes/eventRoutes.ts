import express from 'express';
import { getAllEvents, addEvent, getEventById, deleteEvent, updateEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', addEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
