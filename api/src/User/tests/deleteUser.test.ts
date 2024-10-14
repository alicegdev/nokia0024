import prisma from '../../db/index';
import { deleteUser } from '../users.controller';
import { Request, Response } from 'express';

// Mock de Prisma
jest.mock('../../db/index', () => ({
    user: {
        delete: jest.fn(),
    },
}));

describe('deleteUser', () => {
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

    it('should return 500 if an error occurs', async () => {
        (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

        await deleteUser(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    });
});
