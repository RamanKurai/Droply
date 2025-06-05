import { z } from "zod"

export const SignInSchema  = () => {
    z.object({
        identifier : z
        .string()
        .min(1 , {message : "Email Should be required"})
        .email({message : "Please Enter a valid Email Address"}),
        password : z
        .string()
        .min(1 , {message : "Password Should be required"})
        .min(8 , {message : "Password Should be Atleast 8 characters"})
    })
}