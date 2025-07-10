import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: {
            equals: input.projectId,
          },
        },
        include: {
          fragment: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Please provide a message" }),
        projectId: z
          .string()
          .min(1, { message: "Please provide a project ID" }),
      })
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId,
        },
      });
      await inngest.send({
        name: "code-agent/builder",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return message;
    }),
});
