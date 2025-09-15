import { Hono } from 'hono'
import { cors } from 'hono/cors'
import  {PrismaClient}  from './generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {jwt, sign} from "hono/jwt";
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';



const app = new Hono<{
  Bindings : {
    DATABASE_URL : string;
    SECRET: string;
  }
}>();


app.use('*', cors({
  origin: ['http://localhost:5173', 'https://ink-thoughts.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.route('/blog',blogRouter);
app.route('/user',userRouter);


export default app
