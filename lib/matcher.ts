import { Ollama } from "ollama";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

const ollama = new Ollama();

export async function getTopMatches(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return [];

  const projectRequirementText = `Required Skills: ${project.instruments.join(", ")}`;
  const projectVector = await generateEmbedding(projectRequirementText);

  const candidatePool = await prisma.$queryRaw`
    SELECT e.id, e.skills, e."completedProjects"
    FROM "EngineerProfile" e
    ORDER BY e.embedding <=> ${JSON.stringify(projectVector)}::vector
    LIMIT 20;
  `;

  return candidatePool.slice(0, 5).map((e: any) => e.id);
}