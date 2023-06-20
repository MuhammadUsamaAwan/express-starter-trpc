import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import env from './config/env';
import corsOptions from './config/corsOptions';
import { appRouter } from './router';
import { createContext } from './trpc';

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
app.listen(env.PORT, () => console.log(`Server started on port ${env.PORT}`));
