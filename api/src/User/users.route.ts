import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, loginUser } from '../User/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

export default router;
