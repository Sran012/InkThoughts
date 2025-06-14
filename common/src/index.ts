import z, { string } from "zod";

const signupInput = z.object({
    email : z.string().email(),
    password : z.string(),
    name : z.string().optional()
})

export type signupInput = z.infer<typeof signupInput>;




const signininput = z.object({
    email : z.string().email(),
    password : z.string(),
    name : z.string().optional()
})

export type Signininput = z.infer<typeof signininput>;




const createbloginput = z.object({
    title : string(),
    content : string(),
})

export type Createbloginput = z.infer<typeof createbloginput>;




const updatebloginput = z.object({
    title : string(),
    content : string(),
    id : z.number()
})

export type Updatebloginput = z.infer<typeof updatebloginput>;