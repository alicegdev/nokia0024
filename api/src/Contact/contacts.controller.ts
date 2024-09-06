import { Request, Response, NextFunction } from 'express';
import prisma from '../db/index';

// Get all contacts
export const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contacts = await prisma.contact.findMany();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get a contact by id
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

// Create a new contact
export const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, phoneNumber, isFavorite } = req.body;

        const contact = await prisma.contact.create({
            data: {
                firstName,
                lastName,
                phoneNumber,
                isFavorite: isFavorite || false, // default to false if not provided
            },
        });

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Update a contact by id
export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phoneNumber, isFavorite } = req.body;

        const contact = await prisma.contact.update({
            where: { id: parseInt(id) },
            data: {
                firstName,
                lastName,
                phoneNumber,
                isFavorite,
            },
        });

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Delete a contact by id
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
