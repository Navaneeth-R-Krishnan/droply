import * as z from "zod";

export const signUpSchema = z.object({ 
    email: z.string().min(5,{message: "Email must be at least 5 characters long"}).max(255, {message: "Email must be at most 255 characters long"}).email({message: "Invalid email address"}),
    password: z.string().min(3,{message:"Should be minimum 3 char"}).max(32),
    passwordConfirm: z.string().min(3,{message:"Please confirm passwords"}).max(32),

})
.refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"]
})