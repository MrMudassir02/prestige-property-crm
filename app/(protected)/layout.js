import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function ProtectedLayout({ children }) {
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

  // Admin should use Admin Panel
  if (user.role === "admin") {
    redirect("/admin");
  }

  // Only normal users allowed
  if (user.role !== "user") {
    redirect("/login");
  }

  return <>{children}</>;
}
