"use client";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, SmileIcon } from "lucide-react";
import qs from "qs";
import axios from "axios";
import { UserModal } from "@/hooks/use-modal-action";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useRef, useState } from "react";

interface Props {
  apiKey: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty." }),
});

export const ChatInput = ({ apiKey, query, name, type }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const {theme}=useTheme();

  const { onOpen } = UserModal();
  const isLoading = form.formState.isSubmitting;
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const queryString = qs.stringify(query, { addQueryPrefix: true });
      const url = `${apiKey}${queryString}`;
      await axios.post(url, values);
      form.reset();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const current = form.getValues("content");
    form.setValue("content", current + emoji.native);
    setShowPicker(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center w-full gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg relative"
      >
        {/* File Upload Button */}
        <Button
          type="button"
          size="icon"
          className="bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-700"
          onClick={() => onOpen("fileUrl", { apiUrl: apiKey, query: query })}
        >
          <Plus className="text-white" size={20} />
        </Button>

        {/* Emoji Picker Toggle Button */}
        <div className="relative">
          <Button
            type="button"
            size="icon"
            className="bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-700"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <SmileIcon className="text-white" size={20} />
          </Button>
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-full left-0 z-50 hover:bg-zinc-700"
            >
              <EmojiPicker data={data} onEmojiSelect={handleEmojiSelect} theme={theme} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  placeholder={`Message ${type === "channel" ? `#${name}` : name}`}
                  className="bg-transparent border-none focus:ring-0 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm text-white bg-zinc-200 dark:bg-zinc-600 rounded hover:bg-zinc-700 dark:hover:bg-zinc-700"
        >
          Send
        </Button>
      </form>
    </Form>
  );
};
