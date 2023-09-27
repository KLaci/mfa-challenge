import { Head } from "$fresh/runtime.ts";
import { tw } from "twind";
import URLParser from "../islands/url-parser.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>MFA Challenge</title>
      </Head>
      <URLParser />
      <div class={tw`flex flex-col gap-2 p-4 items-center`}>
        <a
          href="/sign-in"
          class={tw`underline font-bold text-blue-700 text-lg`}
        >
          Sign In
        </a>
      </div>
    </>
  );
}
