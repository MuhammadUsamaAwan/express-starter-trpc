import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import env from './config/env';
import { appRouter } from './router';
import { createContext } from './context';
import corsOptions from './config/corsOptions';

const app = express();

app.use(cors(corsOptions));
app.disable('x-powered-by');

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(env.PORT, () => console.log(`Server Started on Port ${env.PORT}`));
