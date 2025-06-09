import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

export default async function GET() {
    try {
        const {userId} = await auth();
        if (!userId) {
            return NextResponse.json({
                error : "Unauthorized user"
            } , {
                status : 401
            })
        }
    } catch (error) {
        
    }
}