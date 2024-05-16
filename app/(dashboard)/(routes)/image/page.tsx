"use client";

// just go to the shadcn form component documentaion
// it contains the zod configuration also in this tutorial
// it's just that ez

import { useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Download, ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-model";
// replace the any type with this { chatCompoletionRequestMessage }
// import { ChatCompletionRequestMessage } from "openai";

const ImageGeneration = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [images, setImages] = useState<string[]>([]);
  // the form resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });
  // the loading effect
  const isLoading = form.formState.isSubmitting;

  // on submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // we had sat the role property as user to specify whether it's from the user
      // or open ai api

      // cashing (clearing) the previous array
      setImages([]);
      // the values reffers for the values that the user will send to the form
      console.log(values);
      const response = await axios.post("/api/image", {
        values,
      });

      const urls = response.data.map((image: { url: string }) => image.url);

      setImages(urls);

      form.reset();
    } catch (error: any) {
      if (error?.response.status === 403) {
        proModal.onOpen();
      }
      console.log(error);
    } finally {
      router.refresh();
      form.reset();
    }
  };

  console.log(images);

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        Icon={ImageIcon}
        iconColor={"text-pink-700"}
        bgColor={"bg-pink-700/10"}
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <div className="">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              {/* field means the user input (the text that will be written) */}
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps"
                        className="border-0 outline-none focus-visible:rign-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          <div className="p-20">
            <Loader />
          </div>
        )}
        {images.length === 0 && !isLoading && (
          <Empty label="No Images Generated." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {/* before these img work u should copy the host name in the error after the images bieng rendered and copy it to next.config.js */}
          {images.map((img, i) => (
            <Card key={i} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image fill src={img} alt="image" />
              </div>
              <CardFooter className="p-2">
                <Button
                  onClick={() => window.open(img)}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
