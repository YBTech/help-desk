import { Router } from 'express';
import { StatsController } from './stats.controller.js';

const router = Router();
const controller = new StatsController();

router.get('/', controller.getStats);
router.get('/recent', controller.getRecent);

export default router;
