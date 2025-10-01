import { TRPCError } from '@trpc/server';
import type { Context as HonoContext } from 'hono';
import { auth } from '../auth';

export async function createContext(c: HonoContext) {
  const headers = Object.fromEntries(c.req.headers);
  console.log('Incoming headers:', headers);

  const session = await auth.api.getSession({ headers });

  if (!session) {
    return c.json({
      success: false,
      error: "Unauthorized",
      message: "No valid session. Please login first."
    }, 401);
  }

  return {
    session,
    req: c.req,
    res: c.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
