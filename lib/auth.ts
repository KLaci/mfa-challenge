import { Session } from "supabase";
import { supabase } from "./supabase.ts";
import { decode } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

export type UserAction =
  | "/sign-in"
  | "/verify-mfa"
  | "/enroll-mfa"
  | "/dashboard";

// Check the next required action for the user.
export async function getUserAction(session: Session): Promise<UserAction> {
  const user = session?.user;
  const accessToken = session?.access_token;
  if (!user || !accessToken) {
    return "/sign-in";
  }

  // Manually decode the access token to check the aal claim.
  const [_, payload] = decode(accessToken) as [
    unknown,
    { aal: string },
    Uint8Array,
  ];

  if (payload.aal === "aal2") {
    return "/dashboard";
  } else {
    const factors = await supabase.auth.mfa.listFactors();

    if (factors.data?.totp[0]?.status !== "verified") {
      return "/enroll-mfa";
    } else {
      return "/verify-mfa";
    }
  }
}

export async function getUserActionClient(): Promise<UserAction> {
  const sessionData = await supabase.auth.getSession();

  const session = sessionData.data?.session;

  if (!session) {
    return "/sign-in";
  }

  return await getUserAction(session);
}
