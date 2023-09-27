import { useEffect, useMemo, useState } from "preact/hooks";
import { User } from "supabase";
import { supabase } from "../lib/supabase.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "twind";
import { Button } from "../components/Button.tsx";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    if (!IS_BROWSER) return;

    const getUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
    };
    getUser();
  }, []);

  return (
    <div
      className={tw`flex flex-col gap-4 items-center p-4`}
    >
      <h1>hello {user?.email} !</h1>
      <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </div>
  );
}
