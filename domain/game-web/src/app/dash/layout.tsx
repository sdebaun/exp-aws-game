import { TopBar } from "../TopBar";
import { getUserInfo } from "../getUserInfo";
import Link from "next/link";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user info if available, but don't require auth
  const { user, account } = await getUserInfo();

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{ user, account }} />

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <NavTab href="/dash/discover" label="Discover" color="blue" />
            <NavTab href="/dash/guide" label="Guide" color="purple" />
            <NavTab href="/dash/create" label="Create" color="cyan" />
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}

function NavTab({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: "cyan" | "purple" | "blue";
}) {
  // We'll use client-side JavaScript to detect active state in a follow-up
  // For now, all tabs are rendered as links
  const colorClasses = {
    cyan: "hover:text-cyan-400 hover:border-cyan-400",
    purple: "hover:text-purple-400 hover:border-purple-400",
    blue: "hover:text-blue-400 hover:border-blue-400",
  };

  return (
    <Link
      href={href}
      className={`py-4 px-2 text-slate-400 border-b-2 border-transparent transition ${colorClasses[color]}`}
    >
      {label}
    </Link>
  );
}
