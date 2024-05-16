"use client";

// just go to the shadcn form component documentaion
// it contains the zod configuration also in this tutorial
// it's just that ez

import { useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import { useProModal } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";
// replace the any type with this { chatCompoletionRequestMessage }
// import { ChatCompletionRequestMessage } from "openai";

const Conversation = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<any[]>([]);
  // the form resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  // the loading effect
  const isLoading = form.formState.isSubmitting;
  // on submit handler

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // we had sat the role property as user to specify whether it's from the user
      // or open ai api
      const userMessage: any = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [
        ...current,
        userMessage,
        response.data[0].message,
      ]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      router.refresh();
      form.reset();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        Icon={MessageSquare}
        iconColor={"text-violet-500"}
        bgColor={"bg-violet-500/10"}
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <div className="">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        className="border-0 outline-none focus-visible:rign-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="col-span-12 lg:col-span-2 w-full"
              >
                Generate
              </Button>
            </form>
          </div>
        </Form>
      </div>
      <div className="px-3 space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <Empty label="No conversation started." />
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                message.role === "user"
                  ? "bg-white border border-black/10"
                  : "bg-muted"
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
