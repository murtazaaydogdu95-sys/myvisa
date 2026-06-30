import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdmin } from "./auth-token";

// Server-side admin authorization, enforced INSIDE pages and server actions
// (defense in depth — never rely on middleware alone). Fails CLOSED: if no
// admin password is configured, access is denied rather than allowed.
export async function isAdminRequest(): Promise<boolean> {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD || "";
  if (!pass) return false; // fail closed (F-03)
  const cookie = (await cookies()).get("mv_admin")?.value;
  return verifyAdmin(cookie, user);
}

// Use at the top of every admin page: redirects unauthenticated users to login.
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminRequest())) redirect("/admin/login");
}

// Use at the top of every admin server action: throws on unauthorized callers
// so the mutation never runs (and isn't silently treated as a navigation).
export async function assertAdminAction(): Promise<void> {
  if (!(await isAdminRequest())) throw new Error("Unauthorized");
}
