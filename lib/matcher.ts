import { Ollama } from "ollama";
import { prisma } from "@/lib/prisma";

const ollama = new Ollama();

export async function getTopMatches(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  const engineers = await prisma.engineerProfile.findMany({ 
    where: { status: "APPROVED" },
    include: { user: { select: { name: true } } }
  });

  const prompt = `
    Project Title: ${project?.title}
    Description: ${project?.description}
    Required Instruments: ${project?.instruments.join(", ")}

    List of Engineers:
    ${engineers.map(e => `ID: ${e.id}, Skills: ${e.skills.join(", ")}`).join("\n")}

    Task: Pick the top 5 Engineers for this project. 
    Return ONLY a JSON array of IDs. Example: ["id1", "id2"]
  `;

  const response = await ollama.chat({
    model: 'llama3',
    messages: [{ role: 'user', content: prompt }],
    format: 'json'
  });

  return JSON.parse(response.message.content);
}