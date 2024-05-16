"use client";

// just go to the shadcn form component documentaion
// it contains the zod configuration also in this tutorial
// it's just that ez

import Empty from "@/components/Empty";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";
// replace the any type with this { chatCompoletionRequestMessage }
// import { ChatCompletionRequestMessage } from "openai";

const MusicGeneration = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [video, setVideo] = useState<string>("");
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
      setVideo("");
      const response = await axios.post("/api/video", {
        values,
      });
      setVideo(response.data[0]);
      form.reset();
    } catch (error: any) {
      if (error?.response.status === 403) {
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
        title="Video Generation"
        description="Turn your prompt into video."
        Icon={VideoIcon}
        iconColor={"text-orange-700"}
        bgColor={"bg-orange-700/10"}
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
                        placeholder="Clown fish swiming around a coral reef"
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
        {!video && !isLoading && <Empty label="No Video generated." />}
        {video && (
          <video
            src={video}
            controls
            className="w-full aspect-video mt-8 rounded-lg border bg-black"
          />
        )}
      </div>
    </div>
  );
};

export default MusicGeneration;
