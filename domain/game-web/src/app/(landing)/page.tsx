import { getUserInfo } from "../getUserInfo";
import { redirect } from "next/navigation";
import { LandingScroll } from "./_components/LandingScroll";

export default async function LandingPage() {
  const { user } = await getUserInfo();

  // Authenticated users get their dashboard; everyone else sees the pitch
  if (user) {
    redirect("/dash");
  }

  return <LandingScroll />;
}
