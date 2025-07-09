"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Home = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const createProject = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: (data) => {
        router.push("/projects/" + data.id);
      },
      onError: () => {
        console.log("Error");
      },
    })
  );
  const [value, SetValue] = useState("");
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input onChange={(e) => SetValue(e.target.value)} />
        <Button
          onClick={() => {
            createProject.mutate({
              value: value,
            });
          }}
        >
          Invoke Background Job
        </Button>
      </div>
    </div>
  );
};

export default Home;
