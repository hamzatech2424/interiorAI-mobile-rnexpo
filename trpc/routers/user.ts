import { router, protectedProcedure, publicProcedure } from '../init';

export const userRouter = router({
    me: protectedProcedure.query(({ ctx }) => {
        console.log("Session in me router:", ctx.session);
        return { user: ctx.session.user };
    }),
});
