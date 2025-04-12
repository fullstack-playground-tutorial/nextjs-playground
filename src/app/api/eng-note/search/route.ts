import { getApiEnglishNoteService } from "@/app/core/server/context";
import { withError } from "@/app/utils/handler";
import { NextRequest } from "next/server";

async function get(request: NextRequest) {
  const userId = "000001";
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? undefined;
  // validation Q

  //
  try {
    const words = await getApiEnglishNoteService().search(userId, q);
    return new Response(JSON.stringify(words), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

async function post(request: NextRequest) {
  const userId = "000001";
  try {
    const body = await request.json();
    const q = body["q"] as string | undefined;
    const words = await getApiEnglishNoteService().search(userId, q);
    return new Response(JSON.stringify(words), {
      headers: { "Content-Type": "application/json" }, 
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withError(get);
export const POST = withError(post);
