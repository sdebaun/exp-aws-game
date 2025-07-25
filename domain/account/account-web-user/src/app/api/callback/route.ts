import { client, setTokens } from "../../auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("callback");
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  console.log("code", code);
  const exchanged = await client.exchange(
    code!,
    `${url.origin}/account/api/callback`,
  );
  console.log("exchanged", exchanged);
  if (exchanged.err) return NextResponse.json(exchanged.err, { status: 400 });

  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);
  console.log("redirect to", url.origin);
  return NextResponse.redirect(`${url.origin}/account`);
}
