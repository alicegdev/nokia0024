import prisma from '../../db/index';
import { getUserById } from '../users.controller';
import { Request, Response } from 'express';

jest.mock('../../db/index', () => ({
    user: {
        findUnique: jest.fn(),
    },
}));

describe('getUserById', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn(() => ({ json }));
        req = {
            params: { id: '1' },
        };
        res = {
            status,
            json,
        };
    });

    it('should return the user by id', async () => {
        const mockUser = { username: 'User1', email: 'user1@example.com' };

        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        await getUserById(req as Request, res as Response, jest.fn());

        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 if an error occurs', async () => {
        (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

        await getUserById(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    });
});