import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './trpcContext';

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // 👇 forward session into downstream resolvers
      session: ctx.session,
    },
  });
});

export const router = t.router;
