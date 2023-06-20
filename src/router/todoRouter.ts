import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { router, protectedProcedure } from '../trpc';
import db from '../db';
import { todos, users } from '../db/schema';

export const todoRouter = router({
  getTodos: protectedProcedure.query(({ ctx }) => {
    return db.query.todos.findMany({
      where: eq(users.id, ctx.user.id),
    });
  }),
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title } = input;
      const [todo] = await db
        .insert(todos)
        .values({ title, userId: ctx.user.id })
        .returning({ id: todos.id, title: todos.title });
      return todo;
    }),
  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, title } = input;
      const [todo] = await db
        .update(todos)
        .set({ title })
        .where(and(eq(todos.id, id), eq(todos.userId, ctx.user.id)))
        .returning({ id: todos.id, title: todos.title });
      return todo;
    }),
  deleteTodo: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const [todo] = await db
        .delete(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, ctx.user.id)))
        .returning({ id: todos.id, title: todos.title });
      return todo;
    }),
});
