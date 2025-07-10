'use client';

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
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/providers/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserModal } from "@/hooks/use-modal-action";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Server name is required")
    .max(20, "Name must be less than 20 characters"),
  imageUrl: z.string().url().optional(),
});
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
const CreateServerModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type } = UserModal();
  const isModalOpen=isOpen && type === "CreateServer";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting server values:", values);

      await axios.post("/api/servers", values);

      form.reset();
      router.refresh();
      onClose()
    } catch (error: any) {
      console.error("[SERVER_POST_ERROR]", error.message, error.stack);
      alert("Failed to create server: " + error.message);
    }
  };
  const handleclose= () =>{
    form.reset();onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleclose }>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[85vh] bg-white text-black overflow-hidden text-center">
        <DialogHeader>
          <DialogTitle className="font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription>
            Pull off something no one ever has done before...
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
                name="imageUrl"
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-sm font-semibold">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="My Awesome Server"
                      {...field}
                      className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
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
            {isLoading ? "Creating..." : "Create Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
