import { NextRequest } from "next/server";
import { ResponseError } from "../exception/model/response-error";

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const userId = "HARD_CODE_USERID";
    const token = "HARD_CODE_TOKEN";
    // const token = req.cookies.get("token")?.value;
    if (!token || !userId) {
      return new Response("Unauthorized", {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}

export function withError(handler: Handler): Handler {
  return async (req, context) => {
    return handler(req, context).catch((e) => {
      return handleError(e);
    });
  };
}

function handleError(error: unknown) {
  if (error instanceof ResponseError) {
    if (error.status == 422) {
      return new Response(JSON.stringify({ ...error.body }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(error.message, {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
