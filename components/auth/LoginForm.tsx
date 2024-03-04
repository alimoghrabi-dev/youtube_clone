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
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

const RegisterForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Welcome Back");

        router.push("/");
        router.refresh();
      } else {
        toast.error("Something went wrong");
        setErrorMessage("Invalid Credentials");
      }
    } catch (error) {
      console.log("[LOGIN_FORM]", error);
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
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
              <FormLabel>Your Password</FormLabel>
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
            "Login"
          )}
        </Button>
        <div className="h-px w-full bg-gray-100/10" />
        <p className="text-sm font-medium text-gray-300">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="text-primary underline transition hover:text-primary/90"
          >
            Register
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
