import { Router } from 'express';
import { getScores, addScore } from '../Score/scores.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/score', addScore);
router.use(verifyToken);
router.get('/scores', getScores);



export default router;
