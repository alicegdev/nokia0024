import prisma from '../../db/index';
import { addScore, getScores } from '../scores.controller';
import { Request, Response } from 'express';

jest.mock('../../db/index', () => ({
    score: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
}));

describe('Score Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn(() => ({ json }));
        res = {
            status,
            json,
        };
    });

    describe('addScore', () => {
        it('should create a new score successfully', async () => {
            req = {
                body: {
                    score: 100,
                    gameId: 1,
                    userId: 1,
                },
            };

            const mockScore = {
                id: 1,
                score: 100,
                gameId: 1,
                userId: 1,
            };

            (prisma.score.create as jest.Mock).mockResolvedValue(mockScore);

            await addScore(req as Request, res as Response, jest.fn());

            expect(prisma.score.create).toHaveBeenCalledWith({
                data: {
                    score: 100,
                    gameId: 1,
                    userId: 1,
                },
            });
            expect(res.json).toHaveBeenCalledWith(mockScore);
        });

        it('should return 500 if an error occurs', async () => {
            req = {
                body: {
                    score: 100,
                    gameId: 1,
                    userId: 1,
                },
            };

            (prisma.score.create as jest.Mock).mockRejectedValue(new Error('Create error'));

            await addScore(req as Request, res as Response, jest.fn());

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
        });
    });

    describe('getScores', () => {
        it('should get scores for a game successfully', async () => {
            req = {
                body: {
                    gameId: 1,
                },
            };

            const mockScores = [
                {
                    id: 1,
                    score: 100,
                    gameId: 1,
                    userId: 1,
                    User: {
                        username: 'testUser',
                    },
                },
            ];

            (prisma.score.findMany as jest.Mock).mockResolvedValue(mockScores);

            await getScores(req as Request, res as Response, jest.fn());

            expect(prisma.score.findMany).toHaveBeenCalledWith({
                where: {
                    gameId: 1,
                },
                orderBy: {
                    score: 'desc',
                },
                select: {
                    User: {
                        select: {
                            username: true,
                        },
                    },
                },
            });
            expect(res.json).toHaveBeenCalledWith(mockScores);
        });

        it('should return 500 if an error occurs', async () => {
            req = {
                body: {
                    gameId: 1,
                },
            };

            (prisma.score.findMany as jest.Mock).mockRejectedValue(new Error('Find error'));

            await getScores(req as Request, res as Response, jest.fn());

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
        });
    });
});
