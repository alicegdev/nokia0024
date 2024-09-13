import { Request, Response } from 'express';
import prisma from '../db/index';

// Envoyer un message
export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId
      }
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while sending the message' });
  }
};

// Récupérer les messages entre deux utilisateurs
export const getMessages = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;

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
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while retrieving messages' });
  }
};
