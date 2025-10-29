import { redirect } from "next/navigation";

// Naked /dash route redirects to /dash/discover
export default function DashPage() {
  redirect("/dash/discover");
}
