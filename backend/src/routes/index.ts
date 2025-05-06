import express from 'express';
import eventRoutes from './eventRoutes.js';

const router = express.Router();

router.use('/events', eventRoutes);

export default router;
