import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getUserAction } from "../../lib/auth.ts";
import { supabase } from "../../lib/supabase.ts";
import { getCookies } from "https://deno.land/std@0.202.0/http/cookie.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const cookies = getCookies(req.headers);

  const accessToken = cookies["supabase-access-token"];
  const refreshToken = cookies["supabase-refresh-token"];

  if (refreshToken && accessToken) {
    // Manually set the session on the server too
    const sessionSetResponse = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    const session = sessionSetResponse.data.session;

    if (!session) {
      return new Response("", {
        status: 307,
        headers: { Location: "/sign-in" },
      });
    }

    // Check if user has signin with MFA
    const userAction = await getUserAction(session);

    if (userAction === "/dashboard") {
      return await ctx.next();
    } else {
      return new Response("", {
        status: 307,
        headers: { Location: userAction },
      });
    }
  }

  return new Response("", {
    status: 307,
    headers: { Location: "/sign-in" },
  });
}
