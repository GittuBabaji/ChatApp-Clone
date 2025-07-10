"use client";

import qs from "query-string";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/providers/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserModal } from "@/hooks/use-modal-action";

const formSchema = z.object({
  fileUrl: z.string().url().optional(),
});

const MessageFile = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = UserModal();
  const { apiUrl, query } = { ...data };
  const isModalOpen = isOpen && type === "fileUrl";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting values:", values);
      const url = qs.stringifyUrl({
        url: apiUrl ?? "",
        query: query,
      });
      await axios.post(url, { ...values, content: values.fileUrl });
      form.reset();
      router.refresh();
handleClose()    } catch (error: any) {
      console.error("[SERVER_POST_ERROR]", error.message);
      alert("Failed to send file: " + error.message);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[85vh] bg-white text-black overflow-hidden text-center">
        <DialogHeader>
          <DialogTitle className="font-bold">Add an attachment</DialogTitle>
          <DialogDescription>
            Texts can be boring ik
            <br />
            UwU
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="serverImage"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            form="form"
            variant="primary"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFile;
