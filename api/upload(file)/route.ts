import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default async function POST( request : NextRequest ) {
   try {
    const {userId} = await auth()
    if (!userId) {
        return NextResponse.json({
            error : "Unauthorized"
        } ,  { 
            status : 401
        })
    }

    // parse request body
    const body = await request.json()
    const {imagekit , userId : bodyuserId} = body

    if (bodyuserId === !userId) {
        return NextResponse.json({
            error : "Unauthorized"
        } ,  { 
            status : 401
        })
    }
    if (!imagekit || !imagekit.url) {
        return NextResponse.json({
            error : "Invalid File uploaded data"
        } , {
           status : 401
        })
    }

    const fileData = {
      name: imagekit.name || "Untitled",
      path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null, // Root level by default
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };
   //Inserting in the database
    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json(newFile)
   } catch (error) {
    console.error("Error saving File : " , error)
    return NextResponse.json(
      { error: "Failed to save file information" },
      { status: 500 }
    );
   }
}