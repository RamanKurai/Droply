import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export default async function POST(request: Request) {
    try {
        const {userId} = await auth()
        if (!userId) {
            return NextResponse.json({
                error : "Unauthorized"
            } , 
        {status : 401})
        }

        const body = await request.json()
        const {name , userId : bodyuserId , parentId = null} = body
        
        // Verify the user is creating a folder in their own account

        if (bodyuserId !== userId) {
            return NextResponse.json({
                error : "Unauthorized User"
            } , {
                status : 401
            })
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json({
                error : "Folder name is required"
            } , { 
                status : 400
            })
        }

        if (parentId) {
            const [parentFolder] = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.id , parentId),
                    eq(files.userId , userId),
                    eq(files.isFolder , true)
                )
            )
        if (!parentFolder) {
            return NextResponse.json({
                error : "Parent Folder Not Found"
            } , {
                status : 401
            })
        }
        }
      // create a folder in the database

      const folderData = { 
            id: uuidv4(),
            name: name.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl: "",
            thumbnailUrl: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false,
      }

    const [newFolder] = await db.insert(files).values(folderData).returning()

    return NextResponse.json({
         success : true,
         message : "Folder Created Successfully",
         folder : "New Folder"
    })

    } catch (error) {
        
    }
}