import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const helloRouter = router({
  getHello: publicProcedure.query(() => {
    return { message: 'Hello World' };
  }),
  postHello: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ input }) => {
      return { message: `Hello ${input.title} (${input.id})` };
    }),
});
