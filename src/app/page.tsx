"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Home = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button
        onClick={() => {
          invoke.mutate({
            value:
              "Build a responsive calculator using shadcn UI and Tailwind",
          });
        }}
      >
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Home;
