import { TopBar } from "./TopBar";
import { getUserInfo } from "./getUserInfo";
import { HomeUser } from "./HomeUser";

export async function HomeAnon() {
  return (<div className="p-8">
    <h1 className="text-3xl font-bold text-white">Stories Page</h1>
  </div>)
}

export default async function Home() {
  const { user, account, demense } = await getUserInfo();

  // No longer auto-redirect - let user choose when to claim a demense

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account, demense}}/>
      <div className="max-w-7xl mx-auto">
        {user ? <HomeUser {...{user, account, demense}}/> : <HomeAnon/> }
      </div>
    </div>
  )
}
