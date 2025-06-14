import { Hono } from 'hono'
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

app.route('/blog',blogRouter);
app.route('/user',userRouter);


export default app
