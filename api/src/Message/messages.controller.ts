import { Request, Response } from 'express';
import prisma from '../db/index';

// Send a message via REST API
export const sendMessage = async (req: Request, res: Response) => {
  const { receiverId, content } = req.body;
  console.log(`Controller : sending message to ${receiverId}: ${content}`);
  const senderId = req.body.userId; // Retrieved from auth middleware
  console.log(`Controller : sender ID: ${senderId}`);

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        sendDate: new Date(),
      },
    });
    res.status(200).json(message);
    console.log(`Message sent from ${senderId} to ${receiverId}`);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while sending the message' });
  }
};

// Récupérer les messages entre deux utilisateurs
export const getMessages = async (req: Request, res: Response) => {
  console.log('Controller : fetching messages between sender and receiver');
  const { senderId, receiverId } = req.params;
  console.log(senderId, receiverId);
  console.log(`Controller : fetching messages between ${senderId} and ${receiverId}`);
  // si senderId ou receiverId est NaN, renvoyer une erreur
  if (isNaN(parseInt(senderId)) || isNaN(parseInt(receiverId))) {
    return res.status(400).json({ error: 'Invalid senderId or receiverId' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(senderId), receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId), receiverId: parseInt(senderId) }
        ]
      },
      orderBy: {
        sendDate: 'asc'
      }
    });
    res.status(200).json(messages);
    console.log('Fetched messages:', messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Something went wrong while retrieving messages' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  console.log('Controller : fetching conversations for user');
  const userId = req.body.userId;
  console.log(`Controller : fetching conversations for user ${userId}`);

  try {
    const messages: any = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) },
        ],
      },
      orderBy: {
        sendDate: 'desc',
      },
      select: {
        senderId: true,
        receiverId: true,
        content: true,
        sendDate: true,
      },
    });

    const conversationMap: { [key: string]: any } = {};

    messages.forEach((message: { senderId: number; receiverId: any; }) => {
      const otherUserId = message.senderId === parseInt(userId) ? message.receiverId : message.senderId;
      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = message;
      }
    });

    console.log('Conversation map:', conversationMap);

    const conversationPartnerIds = Object.keys(conversationMap).map(id => parseInt(id));

    console.log('Conversation partner IDs:', conversationPartnerIds);

    const users: any = await prisma.user.findMany({
      where: {
        id: { in: conversationPartnerIds },
      },
      select: {
        id: true,
        username: true,
      },
    });

    console.log('Users:', users);

    console.log(parseInt(userId));

    const contacts: any = await prisma.contact.findMany({
      where: {
        userId: { in: conversationPartnerIds },
        ownerId: parseInt(userId),
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log('Contacts:', contacts);

    const contactMap: { [key: string]: any } = {};
    
    contacts.forEach((contact: { userId: string | number | null; firstName: any; lastName: any; }) => {
      if (contact.userId !== null) {
        contactMap[String(contact.userId)] = `${contact.firstName} ${contact.lastName}`;
      }
    });
    
    users.forEach((user: { id: string | number; username: any; }) => {
      if (contactMap[String(user.id)]) {
        user.username = contactMap[String(user.id)];
      }
    });

    const conversations = users.map((user: { id: string | number; }) => ({
      user,
      lastMessage: conversationMap[user.id],
    }));

    res.status(200).json(conversations);
    console.log(`Fetched conversations for user ${userId}`);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Something went wrong while retrieving conversations' });
  }
};
