import { messagesRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectRouter } from "@/modules/project/server/procedures";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
