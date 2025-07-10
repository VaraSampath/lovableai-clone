import ProjectView from "@/modules/project/ui/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface pageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const page = async ({ params }: pageProps) => {
  const { projectId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.project.getOne.queryOptions({
      id: projectId,
    })
  );

  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
