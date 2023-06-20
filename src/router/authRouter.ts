import { z } from 'zod';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { router, publicProcedure } from '../trpc';
import db from '../db';
import { users } from '../db/schema';
import env from '../config/env';

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const alreadyExists = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (alreadyExists) {
        throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
      }
      const hashedPassword = await hash(password);
      const [user] = await db.insert(users).values({ email, password: hashedPassword }).returning({ id: users.id });
      return { accessToken: getAccessToken(user.id) };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!user) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
      const pwdMatches = await verify(user.password, password);
      if (!pwdMatches) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
      return { accessToken: getAccessToken(user.id) };
    }),
});

const getAccessToken = (id: string) =>
  jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: '15d',
  });
