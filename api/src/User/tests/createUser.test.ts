import prisma from '../../db/index';
import { createUser } from '../users.controller';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// Mock de Prisma et bcrypt
jest.mock('../../db/index', () => ({
    user: {
        create: jest.fn(),
    },
}));
jest.mock('bcrypt');

describe('createUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn(() => ({ json }));
        req = {
            body: {
                username: 'newUser',
                email: 'newuser@example.com',
                password: 'password123',
            },
        };
        res = {
            status,
            json,
        };
    });

    it('should create a new user successfully', async () => {
        const mockUser = {
            id: 1,
            username: 'newUser',
            email: 'newuser@example.com',
            password: 'hashedPassword',
        };

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

        await createUser(req as Request, res as Response, jest.fn());

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                username: 'newUser',
                email: 'newuser@example.com',
                password: 'hashedPassword',
                musiques: {
                    create: [],
                },
            },
        });
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 if an error occurs', async () => {
        (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

        await createUser(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    });
});
