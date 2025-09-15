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
      }, 400)
    }
    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
  
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        }
      });
  
      const token = await sign({ id: user.id }, c.env.SECRET);
      
      return c.json(token);
      
    } catch (err: any) {
      return c.json({ 
        error: "Failed to create user. Please try again." 
      }, 500);
    }
})

userRouter.post('/signin', async (c)=> {
  const body = await c.req.json();
  const {success} = signinInput.safeParse(body);
    if (!success){
      return c.json({
        message : "inputs are invalid"
      }, 400)
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
      return c.json({ error: "Invalid email or password" }, 401);
    }
  
    const token = await sign({id : user.id},c.env.SECRET);
    return c.json(token);
  } catch(err){
    return c.json({ 
      error: "Failed to sign in. Please try again." 
    }, 500);
  }  
})
  