import { Router } from 'express';
import { TicketController } from './ticket.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createTicketSchema, updateTicketSchema, updateStatusSchema } from './ticket.schema.js';

const router = Router();
const controller = new TicketController();

router.get('/', controller.getAllTickets);
router.get('/:id', controller.getTicketById);
router.post('/', validateRequest(createTicketSchema), controller.createTicket);
router.put('/:id', validateRequest(updateTicketSchema), controller.updateTicket);
router.patch('/:id/status', validateRequest(updateStatusSchema), controller.updateTicketStatus);
router.delete('/:id', controller.deleteTicket);

export default router;
