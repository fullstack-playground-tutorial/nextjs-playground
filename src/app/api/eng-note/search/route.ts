import mongoDB from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  word: string;
  definition: string;
  searchCount: number;
};

export async function GET(request: NextRequest) {
  const userId = "00001";
  const params = request.nextUrl.searchParams;
  const q = params.get("q");
  try {
    const res = await mongoDB
      .collection("searches")
      .aggregate<SearchResult>([
        {
          $match: {
            userId: userId,
            word: { $regex: q, $options: "i" },
          },
        },

        {
          $lookup: {
            from: "words",
            localField: "word",
            foreignField: "word",
            as: "word_info",
          },
        },
        {
          $unwind: "$word_info", // bung object ra khỏi mảng
        },
        {
          $project: {
            _id: 0,
            word: 1,
            definition: "$word_info.definition",
            searchCount: 1,
          },
        },
      ])
      .toArray();
  } catch (err) {
    if (err instanceof Error) {
      console.error("MongoDB query error:", err.message);
    } else {
      console.error("Unknown error occurred during MongoDB query", err);
    }

    return new Response(
      JSON.stringify({
        error: "Something went wrong while fetching words",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    ); // rethrow lỗi đã gói gọn
  }
}
