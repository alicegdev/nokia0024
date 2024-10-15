import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import prisma from '../db/index';

dotenv.config();

const secretKey = process.env.TOKEN_SECRET_KEY;

if (!secretKey) {
    throw new Error('TOKEN_SECRET_KEY is not defined');
}

// Create a new user
export const addScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { score, gameId, userId } = req.body;
        const scoreObject = await prisma.score.create({
            data: {
                score,
                gameId,
                userId
            }
        });
        res.json(scoreObject);
    } catch (error) {
        console.log("Error adding score, " + error)
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Create a new user
export const getScores = async (req: Request, res: Response, next: NextFunction) => {
   // Get a user by id
    try {
        const { gameId } = req.params;
        const scores = await prisma.score.findMany({
            where: {
                gameId: parseInt(gameId)
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
        res.json(scores);
    } catch (error) {
        console.log("Error getting scores" + error)
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get all users
export const getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await prisma.game.findMany();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};