import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Shared helper to get the authenticated user from the NextAuth session.
 * Works with both Google OAuth and the Demo Credentials login.
 * Returns null if no valid session exists.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const id = (session.user as { id?: string }).id || session.user.email;
    return {
      id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch {
    return null;
  }
}
