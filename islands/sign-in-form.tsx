import { tw } from "twind";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { supabase } from "../lib/supabase.ts";
import { useState } from "preact/hooks";
import { getUserAction, getUserActionClient } from "../lib/auth.ts";

export default function SignInForm() {
  const [error, setError] = useState("");

  const onSubmit = async (
    e: Event,
  ) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string,
      });

      if (res.data?.user) {
        window.location.href = await getUserActionClient();
      } else {
        throw new Error("Error signing in");
      }
    } catch (error) {
      setError(error.message);
    }
    e.preventDefault();

    return false;
  };

  return (
    <div>
      <form
        method="post"
        onSubmit={(e) => {
          onSubmit(e);
          e.preventDefault();
          return false;
        }}
        className={tw`flex flex-col gap-4 items-center p-4`}
      >
        <Input type="email" name="email" label="Email" />
        <Input
          type="password"
          name="password"
          label="Password"
        />

        <Button type="submit">Sign In</Button>
        <p class={tw`text-red-600`}>{error}</p>
      </form>
    </div>
  );
}
