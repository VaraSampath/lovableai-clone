"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const Home = () => {
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        console.log("Success");
      },
    })
  );
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button
        onClick={() => {
          createMessage.mutate({
            value: "Build a responsive calculator using shadcn UI and Tailwind",
          });
        }}
      >
        Invoke Background Job
      </Button>
      {JSON.stringify(messages)}
    </div>
  );
};

export default Home;
