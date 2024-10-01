import { Router } from 'express';
import { sendMessage, getMessages } from './messages.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/send', verifyToken, sendMessage);
router.get('/:senderId/:receiverId', verifyToken, getMessages);

export default router;