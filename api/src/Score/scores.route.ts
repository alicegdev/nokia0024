import { Router } from 'express';
import { getScores, addScore, getGames } from '../Score/scores.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add', verifyToken, addScore);
router.get('/:gameId', getScores);

export default router;
