import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, loginUser, getUserByEmail, updatePassword } from '../User/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.patch('/:id', updatePassword);

router.delete('/:id', deleteUser);
router.use(verifyToken);

// Routes
router.get('/', getAllUsers);
router.get('/by-email/:email', getUserByEmail);


export default router;
