import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../db/index';

dotenv.config();

const secretKey = process.env.TOKEN_SECRET_KEY;

if (!secretKey) {
    throw new Error('TOKEN_SECRET_KEY is not defined');
}

// Login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create a token
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '1h', // Token expiration time
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get a user by id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        const musiques: never[] = [];
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                musiques: {
                    create: musiques
                }
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Delete a user by id
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
