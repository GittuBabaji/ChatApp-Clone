"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserModal } from "@/hooks/use-modal-action";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { CHANNELTYPE } from "@/lib/generated/prisma";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .max(20, "Name must be less than 20 characters")
    .refine((name) => name !== "general", {
      message: "Name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannel = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = UserModal();
  const serverId = data.server?.id;
  const isModalOpen = isOpen && type === "createChannel";
  const { channelType } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT as ChannelType,
    },
  });
   useEffect(() => {
    if (channelType!== "TEXT") {
      console.log("channelType", channelType);
      form.setValue("type", channelType as ChannelType);
    } else {
      form.setValue("type", CHANNELTYPE.TEXT);
    }
  }, [ChannelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = `/api/channels?${qs.stringify({ serverId })}`;
      await axios.post(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("[channel_POST_ERROR]", error.message, error.stack);
      alert("Failed to create channel: " + error.message);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[85vh] bg-white text-black overflow-hidden text-center">
        <DialogHeader>
          <DialogTitle className="font-bold">Add new channels</DialogTitle>
          <DialogDescription>Make it your own</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-sm font-semibold">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="My Awesome Channel"
                      {...field}
                      className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-sm font-semibold">
                    Channel Type
                  </FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 text-white">
                      <SelectItem value="TEXT" className="hover:bg-zinc-700">
                        Text
                      </SelectItem>
                      <SelectItem value="VOICE" className="hover:bg-zinc-700">
                        Voice
                      </SelectItem>
                      <SelectItem value="VIDEO" className="hover:bg-zinc-700">
                        Video
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            form="form"
            variant="primary"
          >
            {isLoading ? "Creating..." : "Create Channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
