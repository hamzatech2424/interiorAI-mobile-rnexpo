import { TRPCError } from '@trpc/server';
import type { Context as HonoContext } from 'hono';
import { auth } from '../auth'; // your better-auth setup

export async function createContext(c: HonoContext) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    // 🚫 Block right here if no valid session
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No valid session. Please login first.',
    });
  }

  return {
    session,
    req: c.req,
    res: c.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
