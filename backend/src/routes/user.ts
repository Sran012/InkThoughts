import { Hono } from 'hono'
import  {PrismaClient}  from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {jwt, sign} from "hono/jwt";
import { signupInput } from 'tsinfer-from-zod';
import { signinInput } from 'tsinfer-from-zod';

export const userRouter = new Hono<{
    Bindings : {
      DATABASE_URL : string;
      SECRET: string;
    }
}>();
  

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if (!success){
      return c.json({
        message : "inputs are invalid"
      })
    }
    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
  
      // const password = bcrypt.hash(body.password,10);
  
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        }
      });
  
      const token = await sign({ id: user.id }, c.env.SECRET);
      
      return c.text(token);
      
    } catch (err) {
      // @ts-ignore
      console.error(err); // This will show in wrangler dev logs
      // @ts-ignore
      return c.text(`Error: ${err.message}`); // This will show the actual error
    }
})

userRouter.post('/signin', async (c)=> {
  const body = await c.req.json();
  const {success} = signinInput.safeParse(body);
    if (!success){
      return c.json({
        message : "inputs are invalid"
      })
    }
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    const user = await prisma.user.findFirst({
      where :{
        email : body.email,
        password : body.password
      }
    });
  
    if(!user){
      return c.json("user not found");
    }
  
    const token = await sign({id : user.id},c.env.SECRET);
    return c.json(token);
  } catch(err){
    return c.json("error occured");
  }  
})
  