import { Request, Response, NextFunction } from 'express';
import prisma from '../db/index';

export const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        const contacts = await prisma.contact.findMany({
            where: { ownerId: parseInt(userId) },
        });

        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const contact = await prisma.contact.findUnique({
            where: { id: parseInt(id) },
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const { firstName, lastName, phoneNumber, email, isFavorite } = req.body;

        const userId = req.body.userId;
        console.log('userId:', userId);

        let contactUserId = null;

        if (email) {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (user) {
                contactUserId = user.id;
            }
        }

        const contact = await prisma.contact.create({
            data: {
                firstName,
                lastName,
                phoneNumber,
                email,
                isFavorite: isFavorite || false,
                userId: contactUserId,
                ownerId: parseInt(userId),
            },
        });

        res.json(contact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phoneNumber, email, isFavorite } = req.body;


        const currentContact = await prisma.contact.findUnique({
            where: { id: parseInt(id) },
        });

        if (!currentContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        let userId = currentContact.userId;

        if (email !== currentContact.email) {
            if (email) {
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (user) {
                    userId = user.id;
                } else {
                    userId = null;
                }
            } else {
                userId = null;
            }
        }

        const updatedContact = await prisma.contact.update({
            where: { id: parseInt(id) },
            data: {
                firstName,
                lastName,
                phoneNumber,
                email,
                isFavorite,
                userId,
            },
        });

        res.json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.contact.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
