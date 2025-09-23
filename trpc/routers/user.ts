import { router, protectedProcedure } from '../init';

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.session.user };
  }),
});
