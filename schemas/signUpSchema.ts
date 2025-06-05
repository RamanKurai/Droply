import { z } from "zod";

export const  SignUpSchema = () => {
      z.object({
         email : z
         .string()
         .min(1)
         .email({ message : "Please Enter a valid email address" }),
         password : z
         .string()
         .min(1 , { message : "Password Should Be Required"})
         .min(1 , { message : "Password Should be Atleast 8 characters"}),
         passwordConfirmation : z
         .string()
         .min(1 , {message : "Please Confirm your password"}),
      })
      .refine( ( data) => data.password === data.passwordConfirmation , {
        message : "Password Does'nt Match",
        path : ["passwordConfirmation"]
      })
}