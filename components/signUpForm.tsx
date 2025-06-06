"use client"
import { SignUpSchema } from "@/schemas/signUpSchema"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function SignUpForm() {
    const [verifying , setVerifying] = useState(false)
    const {signUp, isLoaded , setActive } = useSignUp()
     
    const {
        register ,
        handleSubmit,
        formState :  {errors},
    } = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues : { 
            email: "",
            password: "",
            passwordConfirmation : ""
        }
    })



    
    const onSubmit = async () => {}

    const handleVericationSubmit =  async () => {}

    if (verifying) {
      // we do it later 
      return <h1> 
              this is the OTP verfication field
        </h1>
    }

    return (
         <div>
            <h1>Signup email form or other fields</h1>
         </div>
    )

}