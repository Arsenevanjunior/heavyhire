import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return {
    id: session.user?.id,
    email: session.user?.email,
    name: session.user?.name,
    role: (session.user as any)?.role,
    image: session.user?.image,
  };
}
