import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { validateChatMessage } from "../lib/chatFilter";

const getRoomId = (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join("_");
};

export default function registerDirectChatHandlers(io: Server, socket: Socket) {
  
  socket.on("join_dm", (data: { currentUserId: string; targetUserId: string }) => {
    try {
      const roomName = `dm_${getRoomId(data.currentUserId, data.targetUserId)}`;
      socket.join(roomName);
    } catch {
      socket.emit("dm_error", { message: "Failed to join direct message chat" });
    }
  });

  socket.on("send_dm", async (data: { senderId: string; receiverId: string; content: string }) => {
    try {
      const validation = validateChatMessage(data.content);
      if (!validation.isValid) {
        return socket.emit("dm_error", { message: validation.reason });
      }

      const receiver = await prisma.user.findUnique({ where: { id: data.receiverId } });
      if (!receiver) {
        return socket.emit("dm_error", { message: "User not found." });
      }

      const [user1Id, user2Id] = [data.senderId, data.receiverId].sort();

      const conversation = await prisma.conversation.upsert({
        where: {
          user1Id_user2Id: { user1Id, user2Id }
        },
        update: {
          lastMessage: data.content,
          lastMessageAt: new Date()
        },
        create: {
          user1Id,
          user2Id,
          lastMessage: data.content,
          lastMessageAt: new Date()
        }
      });

      const savedMessage = await prisma.directMessage.create({
        data: {
          conversationId: conversation.id,
          senderId: data.senderId,
          content: data.content
        },
        include: { 
          sender: { select: { id: true, name: true, role: true, image: true } } 
        }
      });

      const roomName = `dm_${getRoomId(data.senderId, data.receiverId)}`;
      io.to(roomName).emit("receive_dm", savedMessage);
      
      io.emit("new_dm_notification", { 
        receiverId: data.receiverId, 
        senderId: data.senderId,
        message: savedMessage,
        conversationId: conversation.id
      });

    } catch {
      socket.emit("dm_error", { message: "Failed to send message" });
    }
  });

  socket.on("edit_dm", async (data: { messageId: string; senderId: string; content: string }) => {
    try {
      const existingMessage = await prisma.directMessage.findUnique({ 
        where: { id: data.messageId },
        include: { conversation: true } 
      });
      
      if (!existingMessage){
        return socket.emit("dm_error", { message: "Message not found" });
      }

      if (existingMessage.senderId !== data.senderId) {
        return socket.emit("dm_error", { message: "You can only edit your own messages" });
      }

      const validation = validateChatMessage(data.content);
      if (!validation.isValid) {
        return socket.emit("dm_error", { message: validation.reason });
      }

      const updatedMessage = await prisma.directMessage.update({
        where: { id: data.messageId },
        data: { 
          content: data.content,
          isEdited: true 
        },
        include: { sender: { select: { id: true, name: true, role: true, image: true } } }
      });

      if (existingMessage.conversation.lastMessage === existingMessage.content) {
        await prisma.conversation.update({
          where: { id: existingMessage.conversationId },
          data: { lastMessage: data.content }
        });
      }

      const roomName = `dm_${getRoomId(existingMessage.conversation.user1Id, existingMessage.conversation.user2Id)}`;
      io.to(roomName).emit("dm_edited", updatedMessage);
    } catch {
      socket.emit("dm_error", { message: "Failed to edit message" });
    }
  });

  socket.on("delete_dm", async (data: { messageId: string; senderId: string }) => {
    try {
      const existingMessage = await prisma.directMessage.findUnique({ 
        where: { id: data.messageId },
        include: { conversation: true }
      });
      
      if (!existingMessage){
        return socket.emit("dm_error", { message: "Message not found" });
      }

      if (existingMessage.senderId !== data.senderId) {
        return socket.emit("dm_error", { message: "You can only delete your own messages" });
      }

      await prisma.directMessage.delete({ where: { id: data.messageId } });

      const roomName = `dm_${getRoomId(existingMessage.conversation.user1Id, existingMessage.conversation.user2Id)}`;
      io.to(roomName).emit("dm_deleted", { messageId: data.messageId });
    } catch {
      socket.emit("dm_error", { message: "Failed to delete message" });
    }
  });

  socket.on("mark_dm_read", async (data: { messageId: string; readerId: string }) => {
    try {
      const existingMessage = await prisma.directMessage.findUnique({ 
        where: { id: data.messageId },
        include: { conversation: true }
      });

      if (existingMessage && existingMessage.senderId !== data.readerId && !existingMessage.isRead) {
        
        await prisma.directMessage.update({
          where: { id: data.messageId },
          data: { isRead: true }
        });

        const roomName = `dm_${getRoomId(existingMessage.conversation.user1Id, existingMessage.conversation.user2Id)}`;
        io.to(roomName).emit("dm_read_receipt", { messageId: data.messageId });
      }
    } catch {
      
    }
  });
}