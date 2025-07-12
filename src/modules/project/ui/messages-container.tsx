"use client";

import MessageCard from "@/modules/messages/ui/message-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageForm from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma";
import MessageLoading from "@/modules/messages/ui/message-loading";
interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment(fragment: Fragment | null): void;
}

const MessagesContainer = ({
  projectId,
  setActiveFragment,
  activeFragment,
}: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId,
      },
      {
        refetchInterval: 5000,
      }
    )
  );

  // useEffect(() => {
  //   const lastAssistantMessage = messages?.find((m) => m.role === "ASSISTANT");

  //   if (lastAssistantMessage && lastAssistantMessage.fragment) {
  //     setActiveFragment(lastAssistantMessage.fragment);
  //   }
  // }, [messages, setActiveFragment]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];

  const isLastMessageUser = lastMessage && lastMessage.role === "USER";

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              role={message.role}
              content={message.content}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => {
                setActiveFragment(message.fragment);
              }}
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
