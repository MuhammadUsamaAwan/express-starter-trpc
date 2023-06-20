import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import type { inferAsyncReturnType } from '@trpc/server';
import env from './config/env';
import db from './db';

type User = {
  id: string;
};

export const createContext = ({ req }: CreateExpressContextOptions) => {
  let user: User | null = null;
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      user = jwt.verify(token, env.JWT_SECRET) as User;
    } catch (error) {
      user = null;
    }
  }
  return {
    db,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
