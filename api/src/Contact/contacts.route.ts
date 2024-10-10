import { Router } from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../Contact/contacts.controller';

import { verifyToken } from '../middlewares/auth.middleware';
const router = Router();

// Routes
router.get('/', verifyToken, getAllContacts);            // Get all contacts
router.get('/:id', verifyToken, getContactById);         // Get a single contact by id
router.post('/', verifyToken, createContact);            // Create a new contact
router.put('/:id', verifyToken, updateContact);          // Update an existing contact by id
router.delete('/:id', verifyToken, deleteContact);       // Delete a contact by id

export default router;
