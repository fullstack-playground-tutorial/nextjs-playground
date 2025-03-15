"use server"
import { headers } from "next/headers";

export default async function NotFound(){
    const headerList = await headers()
    const domain = headerList.get("host")
    console.log("ojksadsa");
    
    return (
        <div>Not Found</div>
    )
}