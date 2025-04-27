import * as z from 'zod';

export const signInSchema = z.object({
    identifier:
    z.string().min(1,{message:"Please Enter your email"}).email({message:"Invalid email address"}),
    password: z.string().min(1,{message:"Please Enter your password"}).max(32),
});
