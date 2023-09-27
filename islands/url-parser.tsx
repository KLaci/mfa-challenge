import { useEffect } from "preact/hooks";
import { supabase } from "../lib/supabase.ts";

export default function URLParser() {
  useEffect(() => {
    const parseInviteUrl = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const sessionSettingResult = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionSettingResult.error) {
          throw sessionSettingResult.error;
        }

        if (sessionSettingResult.data.user) {
          window.location.href = "/set-password";
        }
      }
    };
    parseInviteUrl();
  }, []);

  return null;
}
