import { Router } from 'express';
import { getAllUsers, getUserById, createUser, deleteUser, loginUser, getUserByEmail, updatePassword } from '../User/users.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

router.post('/',
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('A valid email is required'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    ], createUser);
router.post('/login',
    [
      body('email').isEmail().withMessage('A valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ], loginUser);

router.get('/:id', verifyToken, getUserById);
router.patch('/:id',
    [
      body('oldPassword').notEmpty().withMessage('Old password is required'),
      body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long'),
    ], verifyToken, updatePassword);

router.delete('/:id', verifyToken, deleteUser);

router.get('/', getAllUsers);
router.get('/by-email/:email', getUserByEmail);


export default router;
