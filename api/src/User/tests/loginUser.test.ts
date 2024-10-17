import { loginUser } from '../users.controller';
import prisma from '../../db/index';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

        await loginUser(req as Request, res as Response, jest.fn());

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
        expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.TOKEN_SECRET_KEY, { expiresIn: '30d' });
        expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });

    it('should return 404 if user is not found', async () => {
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

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await loginUser(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });
});
