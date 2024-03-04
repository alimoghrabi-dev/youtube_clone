import Sidebar from "@/components/layout/Sidebar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="flex">
      <Sidebar />
      <>{children}</>
    </div>
  );
}
