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
  console.log(`Controller : fetching messages between ${senderId} and ${receiverId}`);

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
