import LoginForm from "@/components/auth/LoginForm";

const Page = () => {
  return (
    <section className="mt-16 flex w-full flex-col items-center gap-y-16">
      <h1 className="text-center text-3xl font-semibold text-white sm:text-4xl">
        Welcome Back
      </h1>
      <LoginForm />
    </section>
  );
};

export default Page;
