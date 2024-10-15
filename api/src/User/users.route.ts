import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, loginUser, getUserByEmail, updatePassword } from '../User/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);

router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updatePassword);

router.delete('/:id', verifyToken, deleteUser);

// Routes
router.get('/', getAllUsers);
router.get('/by-email/:email', getUserByEmail);


export default router;
