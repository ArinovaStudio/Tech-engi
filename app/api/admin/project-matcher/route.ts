import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Ollama } from "ollama";

const ollama = new Ollama();
const MATCHER_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function POST(req: NextRequest) {
    try {

        const { engineers, projectId } = await req.json();

        if (!engineers || !Array.isArray(engineers) || !projectId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing engineers or projectId",
                },
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                invitations: true,
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                },
                { status: 404 }
            );
        }

        const projectSkills = project.instruments.map((skill) =>
            skill.toLowerCase()
        );

        const relevantEngineers = engineers
            .filter((engineer) => {
                const skills = engineer.engineerProfile?.skills ?? [];

                return skills.some((skill: string) =>
                    projectSkills.includes(
                        skill.toLowerCase()
                    )
                );
            })
            .map((engineer) => {
                const skills =
                    engineer.engineerProfile?.skills ?? [];

                const matchedSkills = skills.filter(
                    (skill: string) =>
                        projectSkills.includes(
                            skill.toLowerCase()
                        )
                );

                return {
                    id: engineer.id,
                    name: engineer.name,
                    email: engineer.email,
                    engineerProfile:
                        engineer.engineerProfile,
                    qualification:
                        engineer.engineerProfile?.qualification,
                    completedProjects:
                        engineer.engineerProfile
                            ?.completedProjects ?? 0,
                    yearsOfExperience:
                        engineer.engineerProfile
                            ?.yearsOfExperienceNumber ??
                        engineer.engineerProfile
                            ?.yearsOfExperience ??
                        0,
                    skills,
                    matchedSkills,
                    matchScore: matchedSkills.length,
                };
            })
            .sort(
                (a, b) =>
                    b.matchScore - a.matchScore
            );

        const topCandidates = relevantEngineers.slice(0, 20);

        if (topCandidates.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No active engineers with a matching skill were found for this project",
                    aiSuggestions: [],
                },
                { status: 200 }
            );
        }
        const prompt = `
You are a senior engineering recruiter.

PROJECT

Title:
${project.title}

Description:
${project.description}

Required Skills:
${project.instruments.join(", ")}

Priority:
${project.priority}

Current Phase:
${project.currentPhase}

================================================

ENGINEERS

${topCandidates
                .map(
                    (engineer) => `
Engineer ID: ${engineer.id}

Name: ${engineer.name}

Qualification:
${engineer.qualification}

Skills:
${engineer.skills.join(", ")}

Matched Skills:
${engineer.matchedSkills.join(", ")}

Years Of Experience:
${engineer.yearsOfExperience}

Completed Projects:
${engineer.completedProjects}

Skill Match Score:
${engineer.matchScore}
`
                )
                .join("\n========================================\n")}

================================================

TASK

Select the 5 BEST engineers for this project.

Ranking Priority:

1. Matching skills
2. Years of experience
3. Completed projects
4. Qualification
5. Overall suitability

Return ONLY valid JSON.

{
  "ids": [
    "engineer-id-1",
    "engineer-id-2",
    "engineer-id-3",
    "engineer-id-4",
    "engineer-id-5"
  ]
}

Rules:

- Return exactly 5 engineer IDs.
- No markdown.
- No explanation.
- No text outside JSON.
`;

        let response;
        try {
            response = await ollama.chat({
            model: MATCHER_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            format: "json",
        });
        } catch (error: any) {
            console.error("OLLAMA CHAT ERROR:", error);

            const detail = error?.message ?? String(error);
            const modelMissing =
                error?.status_code === 404 || /not found/i.test(detail);

            return NextResponse.json(
                {
                    success: false,
                    message: modelMissing
                        ? `Ollama model "${MATCHER_MODEL}" is not installed (run: ollama pull ${MATCHER_MODEL})`
                        : `Ollama is not reachable (${detail})`,
                    aiSuggestions: [],
                },
                { status: 503 }
            );
        }

        let recommendedIds: string[] = [];

        try {
            const parsed = JSON.parse(response.message.content);

            recommendedIds = parsed.ids ?? [];
        } catch (error) {
            console.error(
                "OLLAMA JSON PARSE ERROR:",
                error
            );
        }

        const candidateMap = new Map(
            topCandidates.map((engineer) => [engineer.id, engineer])
        );

        const aiSuggestions = recommendedIds
            .filter((id, index) => recommendedIds.indexOf(id) === index)
            .map((id) => candidateMap.get(id))
            .filter(Boolean);

        if (aiSuggestions.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "AI returned no usable recommendations",
                    aiSuggestions: [],
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "AI matching completed",
                aiSuggestions,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "PROJECT MATCHER ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal server error",
            },
            { status: 500 }
        );
    }
}