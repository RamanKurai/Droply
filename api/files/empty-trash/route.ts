import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request : NextRequest,
    props : {
        params : Promise<{fileId : string}>
    }
) {
    try {
        const {userId} = await auth()
        if (!userId) { 
            return NextResponse.json({
                error : "Unauthorized"
            }, {
                status : 401
            })
        }

        const {fileId} = await props.params;

        if (!fileId) {
            return NextResponse.json({
                error : "FileId is Required"
            } , {
                status : 401
            })
        }

        const [file] = await db
         .select()
         .from(files)
         .where(and(eq(files.id , fileId) , 
        eq(files.userId , userId)
        ))

        if (!file) {
            return NextResponse.json({
                error : "File not found"
            } , {
                status : 401
            })
        }

        // Toggle the isStarred Status

        const updatedFiles = await db
        .update(files)
        .set({ isStarred : !file.isStarred })
        .where(and(eq(files.id , fileId), eq(files.userId , userId)))
        .returning()

        const updatedFile = updatedFiles[0];

        return NextResponse.json(updatedFile)
    } catch (error) {
       console.error("Error Starring File :" , error)
       return NextResponse.json({
        error : "Failed To updated file"
       } , {
        status : 500
       })
    }
}