import { router } from '../trpc';
import { helloRouter } from './helloRouter';

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
