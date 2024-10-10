import { loginUser } from '../users.controller';
import prisma from '../../db/index';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de prisma et des dépendances
jest.mock('../../db/index', () => ({
    user: {
        findUnique: jest.fn(),
    },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('loginUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn(() => ({ json }));
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        res = {
            status,
            json,
        };
    });

    it('should return a token for valid user', async () => {
        // Mock de prisma.user.findUnique
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        // Mock de bcrypt.compare
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Mock de jwt.sign
       (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
        expect(options).toEqual({ expiresIn: '1h' }); // Vérifie que l'option est passée
        return 'fakeToken';
    });


        await loginUser(req as Request, res as Response, jest.fn());

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
        expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });

    it('should return 404 if user is not found', async () => {
        // Mock de prisma.user.findUnique qui retourne null
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        await loginUser(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 401 if password is invalid', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        // Mock de bcrypt.compare qui retourne faux
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await loginUser(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });
});
