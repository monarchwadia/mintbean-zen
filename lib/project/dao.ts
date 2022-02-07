import { Project } from "@prisma/client";
import { prismaClient } from "../../prismaClient";

export const createProject = (project: Omit<Project, "createdAt" | "updatedAt" | "id" | "threadId">) => {

  const { title, description, deployedUrl, githubUrl, challengeId, userId } = project;
  
  return prismaClient.project.create({
    data: {
      title,
      description,
      deployedUrl,
      githubUrl,
      thread: {
        create: {}
      },
      challenge: {
        connect: {
          id: challengeId
        }
      },
      user: {
        connect: {
          id: userId,
        }
      }
    },
  })
}