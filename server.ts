import "dotenv/config";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { validateChatMessage } from "./lib/chatFilter";
import { prisma } from "./lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {

    socket.on("join_project", async (data: { projectId: string; userId: string }) => {
      try {
        const project = await prisma.project.findUnique({
          where: { id: data.projectId },
          include: { client: true, engineer: true }
        });

        if (!project) return;

        const isClient = project.client?.userId === data.userId;
        const isEngineer = project.engineer?.userId === data.userId;

        if (isClient || isEngineer) {
          socket.join(`project_${data.projectId}`);
          console.log(`User join: ${data.userId}`);
        } else {
          socket.emit("message_error", { message: "Unauthorized" });
        }

      } catch {
        socket.emit("message_error", { message: "Internal Server Error" });
      }
    });

    socket.on("send_message", async (data: { projectId: string; senderId: string; content: string }) => {
      try {

        const project = await prisma.project.findUnique({
          where: { id: data.projectId },
          include: { client: true, engineer: true }
        });

        if (!project) {
          socket.emit("message_error", { message: "Project not found." });
          return;
        }

        const isClient = project.client?.userId === data.senderId;
        const isEngineer = project.engineer?.userId === data.senderId;

        if (!isClient && !isEngineer) {
          socket.emit("message_error", { message: "Unauthorized" });
          return;
        }

        const validation = validateChatMessage(data.content);
        if (!validation.isValid) {
          socket.emit("message_error", { message: validation.reason });
          return;
        }

        const savedMessage = await prisma.chatMessage.create({
          data: {
            projectId: data.projectId,
            senderId: data.senderId,
            content: data.content
          },
          include: {
            sender: { select: { name: true, role: true, image: true } }
          }
        });

        io.to(`project_${data.projectId}`).emit("receive_message", savedMessage);

      } catch {
        socket.emit("message_error", { message: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Ready on http://${hostname}:${port}`);
    console.log(`WebSocket Server is running securely`);
  });
});