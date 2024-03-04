import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";
import { metadata } from "@/app/layout";
import { db } from "@/lib/prisma";

const fromShema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Title is required" }),
});

const VideoDetailsForm = ({
  setIsOpen,
  videoId,
}: {
  setIsOpen: (open: boolean) => void;
  videoId: string;
}) => {
  const [thumbnail, setThumbnail] = useState("");

  console.log(thumbnail);

  const form = useForm<z.infer<typeof fromShema>>({
    resolver: zodResolver(fromShema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const isEmptyFields =
    form.getValues("title") === "" || form.getValues("description") === "";

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof fromShema>) => {
    try {
      const response = await fetch("/api/video", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          title: data.title,
          description: data.description,
        }),
      });

      if (response.ok) {
        toast.success("Video Uploaded!");
        setIsOpen(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-3.5"
      >
        <p className="text-base font-medium">Details</p>
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Title"
                  className="border-gray-400/20 bg-transparent py-5 outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <FormItem>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Description"
                  className="border-gray-400/20 bg-transparent outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="relative h-32 w-48">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="thumbnail"
              fill
              className="rounded-md object-cover object-center"
            />
          ) : (
            <div className="h-full w-full rounded-md bg-neutral-900/80"></div>
          )}
          {thumbnail && (
            <div className="absolute inset-0 rounded-md bg-black/40" />
          )}

          <UploadButton
            endpoint="videoThumbnailUploader"
            appearance={{
              button:
                "w-auto px-2 absolute inset-0 text-sm h-auto focus-within:text-white focus-within:ring-0 focus-within:ring-offset-0 py-1.5 rounded-sm bg-transparent text-blue-500",
              allowedContent: "hidden",
            }}
            onClientUploadComplete={async (res) => {
              const response = await fetch("/api/thumbnail", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  videoId,
                  thumbnail: res[0].serverData?.thumbnail,
                }),
              });
              if (response.ok) {
                setThumbnail(res[0].serverData?.thumbnail!);
              } else {
                toast.error("Something went wrong");
              }
            }}
          />
        </div>
        <Button
          disabled={isSubmitting || isEmptyFields}
          type="submit"
          className="rounded-[2px] bg-blue-500/85 text-black hover:bg-blue-500/60 disabled:bg-neutral-600"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VideoDetailsForm;
