"use client"
import { SignUpSchema } from "@/schemas/signUpSchema"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { error } from "console"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function SignUpForm() {
    const router = useRouter()
    const [verifying , setVerifying] = useState(false)
    const [isSubmitting , setIsSubmitting] = useState(false)
    const [authError , setAuthError] = useState<string | null>(null)
    const [verificationError , setVerificationError] = useState<string | null>(null)
    const [verificationCode, setVerificationCode] = useState("");
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

    const onSubmit = async (
        data : z.infer<typeof SignUpSchema>
    ) => {
        if (!isLoaded) {
            return ;
        }
        setIsSubmitting(true)
        setAuthError(null)
        try {
            await signUp.create({
                emailAddress : data.email,
                password : data.password
            })

            await signUp.prepareEmailAddressVerification({
                strategy : "email_code"
            })
            setVerifying(true)
        } catch (error : any) {
            console.error("SignUp error : " , error)
            setAuthError(
                error.errors?.[0]?.message || 
                "An error Occured During SignUp , Please Try Again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVericationSubmit =  async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded || !signUp) {
            return ;
        }
        setIsSubmitting(true)
        setVerificationError(null)

        try {
         const result = await signUp.attemptEmailAddressVerification({
            code : verificationCode,
         })

         if (result.status === "complete") {
            await setActive ({
               session : result.createdSessionId
            //    router.push("/dashboard")
            })
         } else {
            console.error("Verification Complete : " , result)
            setVerificationError(
            "An error occurred during verification. Please try again."
            );
         }
        } catch (error : any) {
            console.error("Verification error:", error);
            setVerificationError(
            error.errors?.[0]?.message ||
            "An error occurred during verification. Please try again."
          );
        } finally {
            setIsSubmitting(false)
        }
    }


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