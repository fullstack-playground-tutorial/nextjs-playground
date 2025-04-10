import { NextRequest } from "next/server";
import { ResponseError } from "../exception/model/response-error";

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
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
    return new Response(JSON.stringify({ errors: error.body }), {
      status: error.status,
    });
  } else {
    return new Response(null, {
      status: 500,
    });
  }
}
