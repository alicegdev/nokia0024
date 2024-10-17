import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../db/index';
import { validationResult } from 'express-validator';

dotenv.config();

const secretKey = process.env.TOKEN_SECRET_KEY;

if (!secretKey) {
    throw new Error('TOKEN_SECRET_KEY is not defined');
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '30d'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: { email: true, username: true },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
       await prisma.$transaction([
            prisma.musique.deleteMany({ where: { userId: parseInt(id) } }),
            prisma.message.deleteMany({ where: { senderId: parseInt(id) } }),
            prisma.message.deleteMany({ where: { receiverId: parseInt(id) } }),
            prisma.score.deleteMany({ where: { userId: parseInt(id) } }),
            prisma.contact.deleteMany({ where: { userId: parseInt(id) } }),
            prisma.user.delete({ where: { id: parseInt(id) } }),
        ]);
        res.json({ message: 'User and all related data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, username: true },
      });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Utilisateur introuvable' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};
  
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { password: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: { password: hashedNewPassword },
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
