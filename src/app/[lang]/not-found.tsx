"use server"
import { headers } from "next/headers";

export default async function NotFound(){
    const headerList = await headers()
    const domain = headerList.get("host")
    return (
        <div>Not Found</div>
    )
}