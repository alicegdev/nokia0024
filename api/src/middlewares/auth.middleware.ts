import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
    id: string;
}

const secretKey = process.env.TOKEN_SECRET_KEY

if (!secretKey) {
    throw new Error('TOKEN_SECRET_KEY is not defined');
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        const payload = decoded as JwtPayload;
        req.body.userId = payload.id;
        next();
    });
};
