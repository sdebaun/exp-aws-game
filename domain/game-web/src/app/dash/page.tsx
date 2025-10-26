import { TopBar } from "../TopBar";
import { getUserInfo } from "../getUserInfo";
import { HomeUser } from "./_components/HomeUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user, account } = await getUserInfo();

  // No user? Boot them back to the public landing
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account}}/>
      <HomeUser {...{user, account}}/>
    </div>
  );
}
