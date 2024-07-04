import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Définir l'interface pour le payload du JWT
interface JwtPayload {
    id: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        // Assert that decoded is of type JwtPayload
        const payload = decoded as JwtPayload;
        // Save the token in the request for use in other routes if needed
        req.body.userId = payload.id;
        next();
    });
};
