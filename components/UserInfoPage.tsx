"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import copy from "clipboard-copy";
import { UploadButton } from "@/lib/uploadthing";
import HoverIcon from "./shared/HoverIcon";
import AddLink from "./shared/AddLink";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  handle: z
    .string()
    .min(3, { message: "Handle should be at least 3 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description should be at most 1000 characters" })
    .optional(),
  contactEmailInfo: z.string().email({ message: "Invalid email" }).optional(),
});

interface UserInfoPageProps {
  defaultName: string | undefined;
  defaultHandle: string | undefined;
  defaultDescription: string | undefined;
  userImage: string | undefined;
  userId: string | undefined;
  contactEmail: string | undefined;
  userLinks: {
    id: string;
    title: string;
    url: string;
    userId: string;
    addedAt: Date;
  }[];
}

const UserInfoPage = ({
  defaultName,
  defaultHandle,
  defaultDescription,
  userImage,
  userId,
  contactEmail,
  userLinks,
}: UserInfoPageProps) => {
  const router = useRouter();

  const [showMaxTextareaMessage, setShowMaxTextareaMessage] =
    useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const textToCopy = `http://localhost:3000/profile/${userId}`;

  const handleCopyClick = async () => {
    await copy(textToCopy);
    setIsCopied(true);

    toast.success("Text copied to clipboard");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
      handle: defaultHandle,
      description: defaultDescription,
      contactEmailInfo: contactEmail,
    },
  });

  const isButtonsDisabled =
    defaultName === form.getValues("name") &&
    defaultHandle === form.getValues("handle") &&
    defaultDescription === form.getValues("description") &&
    contactEmail === form.getValues("contactEmailInfo");

  const handleCancel = () => {
    form.reset();
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          handle: values.handle,
          description: values.description,
          contactEmail: values.contactEmailInfo,
        }),
      });

      if (response.ok) {
        toast.success("Profile Updated");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[USER_INFO_PAGE]", error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex w-full items-center justify-end gap-x-3 border-b border-gray-400/20 px-5 pb-4">
          <Button
            disabled={isButtonsDisabled}
            onClick={handleCancel}
            type="button"
            variant={"ghost"}
            className="rounded-sm text-blue-500/85 transition duration-100 hover:bg-transparent hover:text-blue-500/75 active:bg-blue-500/25 disabled:text-gray-400/40"
          >
            Cancel
          </Button>
          <Button
            disabled={isButtonsDisabled || isSubmitting}
            type="submit"
            className="rounded-sm bg-blue-500/85 hover:bg-blue-500/60 disabled:bg-neutral-600/80 disabled:text-black/80"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Publish"
            )}
          </Button>
        </div>
        <div className="w-full space-y-8 p-8">
          <div className="flex w-full items-center gap-x-4">
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormDescription>
                    Choose a channel name that represents you and your content.
                  </FormDescription>
                  <FormControl>
                    <Input
                      className="border-gray-400/20 bg-transparent py-5 capitalize outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={defaultName || "Set your Name"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center gap-y-0.5 px-0 sm:px-8">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="user_image"
                  width={750}
                  height={750}
                  className="h-[78px] w-[78px] rounded-full object-cover object-center"
                />
              ) : (
                <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-xl font-medium uppercase text-gray-50">
                  {getInitials(defaultName || "")}
                </div>
              )}
              <UploadButton
                endpoint="userImage"
                appearance={{
                  button:
                    "w-auto px-2 text-sm h-auto focus-within:text-white focus-within:ring-0 focus-within:ring-offset-0 py-1.5 rounded-sm bg-transparent text-blue-500",
                  allowedContent: "hidden",
                }}
                onClientUploadComplete={() => {
                  toast.success("Profile Image Updated");
                  router.refresh();
                }}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name={"handle"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Handle</FormLabel>
                <FormDescription>
                  Choose your unique handle by adding letters and numbers.
                </FormDescription>
                <FormControl>
                  <Input
                    className="border-gray-400/20 bg-transparent py-5 outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={defaultHandle || "Set your Handle"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className="relative">
                {showMaxTextareaMessage && (
                  <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-400">
                    {field.value?.length || "0"}/1000
                  </span>
                )}

                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea
                    onFocus={() => setShowMaxTextareaMessage(true)}
                    rows={4}
                    maxLength={1000}
                    className="border-gray-400/20 bg-transparent outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={defaultDescription || "Set your Description"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="w-full">
            <FormLabel className="text-base">Channel URL</FormLabel>
            <FormDescription>
              This is the standard web address for your channel.
            </FormDescription>
            <FormControl className="w-full">
              <div className="relative flex w-full items-center justify-between rounded-md border border-gray-400/20 bg-neutral-900/50 px-4 py-2.5">
                <p className="text-sm font-normal">{textToCopy}</p>
                <HoverIcon
                  icon={Copy}
                  className={cn(
                    "cursor-pointer",
                    isCopied
                      ? "text-blue-500"
                      : "text-gray-300 transition hover:text-gray-50",
                  )}
                  content={isCopied ? "Copied" : "Copy"}
                  onClick={handleCopyClick}
                  size={24}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name={"contactEmailInfo"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Contact info</FormLabel>
                <FormDescription>
                  Let people know how to contact you with business inquiries.
                </FormDescription>
                <FormControl>
                  <Input
                    className="w-2/3 border-gray-400/20 bg-transparent outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0 md:w-1/2 lg:w-1/3"
                    placeholder={contactEmail || "Email address"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
      <AddLink userLinks={userLinks} />
    </Form>
  );
};

export default UserInfoPage;
