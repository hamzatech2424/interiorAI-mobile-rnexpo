import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './trpcContext';

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {

    if (!ctx.session) {
        return ctx.res.json({
            success: false,
            error: "Unauthorized",
            message: "No valid session. Please login first."
        }, 401);
    }

    return next({
        ctx: {
            session: ctx.session,
        },
    });
});

export const router = t.router;
