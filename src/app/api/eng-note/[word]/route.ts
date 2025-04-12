import { getApiEnglishNoteService } from "@/app/core/server/context";
import { withError } from "@/app/utils/handler";
import { NextRequest } from "next/server";

type Params = {
  word: string;
};

async function get(request: NextRequest, params: Promise<Params>) {
  const userId = "000001";
  const { word } = await params;
  try {
    const wordInfo = await getApiEnglishNoteService().load(userId, word);
    return new Response(JSON.stringify(wordInfo), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withError(get);
