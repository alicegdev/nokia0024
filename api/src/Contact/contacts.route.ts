import { Router } from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../Contact/contacts.controller';

const router = Router();

// Routes
router.get('/', getAllContacts);            // Get all contacts
router.get('/:id', getContactById);         // Get a single contact by id
router.post('/', createContact);            // Create a new contact
router.put('/:id', updateContact);          // Update an existing contact by id
router.delete('/:id', deleteContact);       // Delete a contact by id

export default router;
