import { AppProps } from "$fresh/server.ts";
import { tw } from "twind";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>mfa-challenge</title>
      </head>
      <body class={tw`text-gray-700`}>
        <Component />
      </body>
    </html>
  );
}
