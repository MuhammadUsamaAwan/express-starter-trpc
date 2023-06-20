import { router } from '../trpc';
import { authRouter } from './authRouter';
import { todoRouter } from './todoRouter';

export const appRouter = router({
  auth: authRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
