import { Hono } from 'hono'
import  {PrismaClient}  from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {jwt, sign,verify} from "hono/jwt";
import { createblogInput } from 'tsinfer-from-zod';
import { updateblogInput } from 'tsinfer-from-zod';

export const blogRouter = new Hono<{
    Bindings : {
      DATABASE_URL : string;
      SECRET: string;
    },
    Variables : {
        userId : String;
    }
}>();


blogRouter.use('/*',async (c,next)=>{
    const header = c.req.header("Authorization") || "";
    const user = await  verify(header,c.env.SECRET);
    if(user){
        c.set("userId", user.id);
        await next();
    } else {
        return c.json({message : "you are not logged !!"});
    }
    
})
  
blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const {success} = createblogInput.safeParse(body);
        if (!success){
          return c.json({
            message : "inputs are invalid"
          })
        }
    const userId = c.get("userId");
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.create({
        data : {
            title : body.title,
            content : body.content,
            authorId: Number(userId)
        }
    })


    return c.json(blog.id);
})



blogRouter.put('/',async (c)=>{
    const body = await c.req.json();
    const {success} = updateblogInput.safeParse(body);
        if (!success){
          return c.json({
            message : "inputs are invalid"
          })
        }
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.update({
        where:{
            id : body.id,
        },
        data : {
            title : body.title,
            content : body.content,
        }
    })


    return c.json(blog.id);
})

blogRouter.get('/get/:id',async (c)=>{
    const id = c.req.param("id");
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.findFirst({
        where:{
            id : Number(id)
        },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
    })


    return c.json(blog);
})


blogRouter.get('/bulk', async (c)=>{
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        blogs
    });
})