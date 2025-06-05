"use client"
import { useSignUp } from "@clerk/nextjs"
import { useState } from "react"

export default function SignUpForm() {
    const [verifying , setVerifying] = useState(false)
    const {signUp, isLoaded , setActive } = useSignUp()
    
    const onSubmit = async () => {}

    const handleVericationSubmit =  async () => {}

    if (verifying) {
        return <div>
            // we do it later
        </div>
    }

}