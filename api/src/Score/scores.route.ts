import { Router } from 'express';
import { getScores, addScore } from '../Score/scores.controller';
//import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add', addScore);
//router.use(verifyToken);
router.get('/', getScores);



export default router;
