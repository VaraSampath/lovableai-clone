import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";
export const projectRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id },
      });
      if (!project) throw new Error("Project not found");

      return project;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Please provide a message" }),
      })
    )
    .mutation(async ({ input }) => {
      const project = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
        },
      });
      await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: project.id,
        },
      });
      await inngest.send({
        name: "code-agent/builder",
        data: {
          value: input.value,
          projectId: project.id,
        },
      });
      return project;
    }),
});
