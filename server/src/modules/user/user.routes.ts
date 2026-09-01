import { Router } from 'express';
import { UserController } from './user.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { loginSchema } from './user.schema.js';

const router = Router();
const controller = new UserController();

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.post('/login', validateRequest(loginSchema), controller.login);

export default router;
