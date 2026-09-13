import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const result = verifyToken(token);

  if (!result.success) {
    redirect("/login");
  }

  const user = result.user;

  // Only admin allowed
  if (user.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
