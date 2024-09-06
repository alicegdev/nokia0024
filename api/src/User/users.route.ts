import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, loginUser } from '../User/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);

router.use(verifyToken);

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);


export default router;
