import { Vocabulary } from "@/app/feature/english-note/english-note";
import { withAuth, withError } from "@/app/utils/handler";
import { NextRequest } from "next/server";

// async function post(request: NextRequest) {
//   const userId = "000001";
//   try {
//     const body = await request.json();
//     const word = body as Vocabulary | undefined;
//     if (!(word && word.word.length > 0 && word.definition.length > 0)) {
//       return new Response(null, { status: 400 });
//     }
//     const res = await getApiEnglishNoteService().insert(
//       userId,
//       word.word,
//       word.definition
//     );
//     return new Response(JSON.stringify(res), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     throw error;
//   }
// }

// export const POST = withError(withAuth(post));
