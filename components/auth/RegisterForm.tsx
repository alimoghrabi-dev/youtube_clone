"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const RegisterForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.status === 201) {
        toast.success("User created successfully");

        router.push("/login");
      } else {
        toast.error("Something went wrong");
        setErrorMessage("Email already exists");
      }
    } catch (error) {
      console.log("[REGISTER_FORM]", error);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="w-80 space-y-4 sm:w-96"
      >
        <div className="flex items-center gap-x-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Your Name <span className="text-orange-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="rounded-sm border-slate-100/10 outline-none transition placeholder:text-sm placeholder:text-gray-400 hover:border-slate-300/50 focus-visible:ring-primary/80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(optional)"
                    {...field}
                    className="rounded-sm border-slate-100/10 outline-none transition placeholder:text-sm placeholder:text-gray-400 hover:border-slate-300/50 focus-visible:ring-primary/80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Email <span className="text-orange-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="rounded-sm border-slate-100/10 outline-none transition placeholder:text-sm placeholder:text-gray-400 hover:border-slate-300/50 focus-visible:ring-primary/80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Password <span className="text-orange-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  className="rounded-sm border-slate-100/10 outline-none transition placeholder:text-sm placeholder:text-gray-400 hover:border-slate-300/50 focus-visible:ring-primary/80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-center text-sm font-medium text-red-500">
            {errorMessage}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
        <div className="h-px w-full bg-gray-100/10" />
        <p className="text-sm font-medium text-gray-300">
          {"Already have an account? "}
          <Link
            href="/login"
            className="text-primary underline transition hover:text-primary/90"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
