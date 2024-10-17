import { getAllUsers } from '../users.controller';
import prisma from '../../db/index';
import { Request, Response } from 'express';

jest.mock('../../db/index', () => ({
    user: {
        findMany: jest.fn(),
    },
}));

describe('getAllUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn(() => ({ json }));
        req = {};
        res = {
            status,
            json,
        };
    });

    it('should return all users successfully', async () => {
        // Mock de prisma.user.findMany pour renvoyer une liste d'utilisateurs
        (prisma.user.findMany as jest.Mock).mockResolvedValue([
            { id: 1, username: 'User1', email: 'user1@example.com' },
            { id: 2, username: 'User2', email: 'user2@example.com' },
        ]);

        await getAllUsers(req as Request, res as Response, jest.fn());

        expect(prisma.user.findMany).toHaveBeenCalled();  // Vérifie que la fonction findMany a bien été appelée
        expect(res.json).toHaveBeenCalledWith([
            { id: 1, username: 'User1', email: 'user1@example.com' },
            { id: 2, username: 'User2', email: 'user2@example.com' },
        ]);  // Vérifie que la réponse contient la liste des utilisateurs
    });

    it('should return 500 if an error occurs', async () => {
        // Simule une erreur avec prisma.user.findMany
        (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

        await getAllUsers(req as Request, res as Response, jest.fn());

        expect(prisma.user.findMany).toHaveBeenCalled();  // Vérifie que findMany a bien été appelée
        expect(res.status).toHaveBeenCalledWith(500);  // Vérifie que le statut 500 a été envoyé
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });  // Vérifie que le message d'erreur est envoyé
    });
});
