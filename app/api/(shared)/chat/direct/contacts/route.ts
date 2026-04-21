import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    let allowedContacts: any[] = [];

    if (user.role === "ADMIN") {
      allowedContacts = await prisma.user.findMany({
        where: { role: { in: ["CLIENT", "ENGINEER"] } },
        select: { id: true, name: true, role: true, image: true }
      });
    } 

    else if (user.role === "CLIENT") {
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, name: true, role: true, image: true } });
      
      const myProjects = await prisma.project.findMany({
        where: { clientId: user.clientProfile!.id },
        include: { engineer: { include: { user: { select: { id: true, name: true, role: true, image: true } } } } }
      });
      
      const engineers = myProjects.map(p => p.engineer?.user).filter(Boolean);
      
      const uniqueEngineers = Array.from(new Map(engineers.map(e => [e?.id, e])).values());
      allowedContacts = [...admins, ...uniqueEngineers];
    } 

    else if (user.role === "ENGINEER") {
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true, name: true, role: true, image: true } });
      
      const myProjects = await prisma.project.findMany({
        where: { engineerId: user.engineerProfile!.id },
        include: { client: { include: { user: { select: { id: true, name: true, role: true, image: true } } } } }
      });
      
      const clients = myProjects.map(p => p.client.user).filter(Boolean);
      
      const uniqueClients = Array.from(new Map(clients.map(c => [c.id, c])).values());
      allowedContacts = [...admins, ...uniqueClients];
    }

    const myConversations = await prisma.conversation.findMany({
      where: { OR: [{ user1Id: user.id }, { user2Id: user.id }] }
    });

    const contactsWithConversations = allowedContacts.map(contact => {
      const convo = myConversations.find(c => c.user1Id === contact.id || c.user2Id === contact.id);
      return {
        ...contact,
        conversationId: convo?.id || null,
        lastMessage: convo?.lastMessage || null,
        lastMessageAt: convo?.lastMessageAt || null,
      };
    }).sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    return NextResponse.json({ success: true, contacts: contactsWithConversations }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}