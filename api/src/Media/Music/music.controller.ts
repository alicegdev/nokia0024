import { Request, Response, NextFunction } from 'express';
import prisma from 'src/db';

// Get all musics
export const getAllMusics = async (res: Response, next: NextFunction) => {
    try {
        const musics = await prisma.music.findMany();
        res.json(musics);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get a music by id
export const getMusicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const music = await prisma.music.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(music);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const deleteMusic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.music.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'Music deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

