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


blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
        c.status(401);
        return c.json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = await verify(token, c.env.SECRET);
        if (user && user.id) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(401);
            return c.json({ message: "You are not logged in!" });
        }
    } catch (e) {
        c.status(401);
        return c.json({ message: "Invalid or expired token" });
    }
})
  
blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const {success} = createblogInput.safeParse(body);
        if (!success){
          return c.json({
            message : "inputs are invalid"
          }, 400)
        }
    const userId = c.get("userId");
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.create({
            data : {
                title : body.title,
                content : body.content,
                authorId: Number(userId)
            }
        });

        return c.json(blog.id);
    } catch (err) {
        return c.json({ error: "Failed to create blog" }, 500);
    }
})



blogRouter.put('/',async (c)=>{
    const body = await c.req.json();
    const {success} = updateblogInput.safeParse(body);
        if (!success){
          return c.json({
            message : "inputs are invalid"
          }, 400)
        }
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.update({
            where:{
                id : body.id,
            },
            data : {
                title : body.title,
                content : body.content,
            }
        });

        return c.json(blog.id);
    } catch (err) {
        return c.json({ error: "Failed to update blog" }, 500);
    }
})

blogRouter.get('/get/:id',async (c)=>{
    const id = c.req.param("id");
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
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
        });

        if (!blog) {
            return c.json({ error: "Blog not found" }, 404);
        }

        return c.json(blog);
    } catch (err) {
        return c.json({ error: "Failed to fetch blog" }, 500);
    }
})


blogRouter.get('/bulk', async (c)=>{
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
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
    } catch (err) {
        return c.json({ error: "Failed to fetch blogs" }, 500);
    }
})