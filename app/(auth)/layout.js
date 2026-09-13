import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function AuthLayout({ children }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  // No token = Login/Register allowed
  if (!token) {
    return <>{children}</>;
  }

  const result = verifyToken(token);

  // Invalid token = Login/Register allowed
  if (!result.success) {
    return <>{children}</>;
  }

  const user = result.user;

  // Admin
  if (user.role === "admin") {
    redirect("/admin");
  }

  // Normal user
  redirect("/dashboard");
}
