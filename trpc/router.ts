import { router } from './init';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
});
