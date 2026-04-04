import { Ollama } from "ollama";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

const ollama = new Ollama();

export async function getTopMatches(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return [];

  const projectRequirementText = `Project: ${project.title}. Needs: ${project.instruments.join(", ")}. Description: ${project.description}`;
  const projectVector = await generateEmbedding(projectRequirementText);
  const vectorString = JSON.stringify(projectVector);

  const candidateEngineers: any[] = await prisma.$queryRaw`
    SELECT id, skills
    FROM "EngineerProfile"
    WHERE status = 'APPROVED'
    AND id NOT IN (
      SELECT "engineerId" 
      FROM "ProjectInvitation" 
      WHERE "projectId" = ${projectId}
    )
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT 20;
  `;

  if (candidateEngineers.length === 0) return [];

  const prompt = `
    Project: ${project.title}
    Details: ${project.description}
    Needs: ${project.instruments.join(", ")}

    Evaluate these ${candidateEngineers.length} highly relevant engineers and pick the top 5 absolute best matches:
    ${candidateEngineers.map(e => `ID: ${e.id}, Skills: ${e.skills.join(", ")}`).join("\n")}

    Task: Return a JSON object with a single key called "ids" containing an array of the 5 selected engineer IDs.
    Example: { "ids": ["id1", "id2", "id3"] }
  `;

  try {
    const response = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: prompt }],
      format: 'json'
    });

    const result = JSON.parse(response.message.content);
    
    let matchedIds: string[] = [];
    
    if (Array.isArray(result)) matchedIds = result;
    else if (result.ids && Array.isArray(result.ids)) matchedIds = result.ids;
    else {
      const possibleArray = Object.values(result).find(Array.isArray);
      if (possibleArray) matchedIds = possibleArray as string[];
    }

    if (matchedIds.length === 0) throw new Error("Could not extract array");

    return matchedIds.slice(0, 5);
    
  } catch {
    return candidateEngineers.slice(0, 5).map(e => e.id);
  }
}