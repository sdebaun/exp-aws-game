import { redirect } from 'next/navigation';
import { getUserInfo } from '@/app/getUserInfo';

export default async function StoryUnlockNextPage({ params }: { params: { id: string } }) {
  const { user } = await getUserInfo();

  if (!user) {
    redirect(`/auth/login?returnTo=/story/${params.id}/unlock-next`);
  }

  // TODO: Implement scene unlocking with ink
  // For now, redirect back to story page with a query param
  redirect(`/story/${params.id}?unlock=next`);
}