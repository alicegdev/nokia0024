import { Router } from 'express';
import { sendMessage, getMessages } from './messages.controller';

const router = Router();

router.post('/send', sendMessage);
router.get('/:senderId/:receiverId', getMessages);

export default router;
