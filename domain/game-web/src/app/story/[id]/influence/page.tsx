import { redirect } from 'next/navigation';
import { getUserInfo } from '@/app/getUserInfo';

export default async function StoryInfluencePage({ params }: { params: { id: string } }) {
  const { user } = await getUserInfo();

  if (!user) {
    redirect(`/auth/login?returnTo=/story/${params.id}/influence`);
  }

  // TODO: Implement influence actions (voting, sending ink, etc.)
  // For now, redirect back to story page with a query param
  redirect(`/story/${params.id}?mode=influence`);
}