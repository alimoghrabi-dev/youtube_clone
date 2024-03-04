import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Plus, Trash } from "lucide-react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import HoverIcon from "./HoverIcon";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z.string().url({ message: "Invalid URL" }),
});

interface AddLinkProps {
  userLinks: {
    id: string;
    title: string;
    url: string;
    userId: string;
    addedAt: Date;
  }[];
}

const AddLink = ({ userLinks }: AddLinkProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/link", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.getValues("title"),
          url: form.getValues("url"),
        }),
      });

      if (response.ok) {
        toast.success("Link removed");
        router.refresh();
      } else if (response.status === 404) {
        setIsOpen(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[REMOVE_LINK]", error);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          url: values.url,
        }),
      });

      if (response.ok) {
        toast.success("Link added");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[ADD_LINK]", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full px-8 pb-5"
      >
        <FormItem className="space-y-4">
          <div className="space-y-2">
            <FormLabel className="text-base">Links</FormLabel>
            <FormDescription>
              Share external links with your viewers.
            </FormDescription>
            <div className="flex flex-col items-start gap-y-4">
              {userLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex w-full items-center gap-x-4 md:gap-x-6"
                >
                  <HoverIcon
                    icon={Trash}
                    size={20}
                    className="cursor-pointer text-primary"
                    content="Remove"
                    onClick={handleRemove}
                  />

                  <div className="flex w-full items-center gap-x-2.5 lg:w-2/3">
                    <FormItem className="w-[35%]">
                      <FormControl className="w-full">
                        <div className="w-full rounded-md border border-gray-400/20 bg-neutral-900/50 p-2.5 text-sm font-normal transition focus-visible:border-blue-500/80">
                          {link.title}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem className="w-[65%]">
                      <FormControl className="w-full">
                        <div className="w-full rounded-md border border-gray-400/20 bg-neutral-900/50 p-2.5 text-sm font-normal text-gray-300 transition focus-visible:border-blue-500/80">
                          {link.url}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FormControl>
            {isOpen ? (
              <>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex w-full items-center gap-x-4 md:gap-x-6"
                >
                  {isHovered ? (
                    <HoverIcon
                      icon={Trash}
                      size={20}
                      className="cursor-pointer text-primary"
                      content="Remove"
                      onClick={handleRemove}
                    />
                  ) : (
                    <HiOutlineMenuAlt4 size={20} className="text-gray-400" />
                  )}

                  <div className="flex w-full items-center gap-x-2.5 lg:w-2/3">
                    <FormField
                      control={form.control}
                      name={"title"}
                      render={({ field }) => (
                        <FormItem className="w-[35%]">
                          <FormControl className="w-full">
                            <Input
                              placeholder="Title (required)"
                              className="w-full border-gray-400/20 bg-transparent py-5 outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={"url"}
                      render={({ field }) => (
                        <FormItem className="w-[65%]">
                          <FormControl className="w-full">
                            <Input
                              placeholder="URL (required)"
                              className="w-full border-gray-400/20 bg-transparent py-5 outline-none transition focus-visible:border-blue-500/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" size={"sm"}>
                  Create Link
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-x-1.5 uppercase text-blue-500/90"
              >
                <Plus />
                Add Link
              </button>
            )}
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
};

export default AddLink;
