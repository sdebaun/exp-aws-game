import { redirect } from 'next/navigation';
import { getUserInfo } from '@/app/getUserInfo';

export default async function StoryJoinPage({ params }: { params: { id: string } }) {
  const { user } = await getUserInfo();

  if (!user) {
    redirect(`/auth/login?returnTo=/story/${params.id}/join`);
  }

  // TODO: Implement character selection for joining story
  // For now, redirect to character selection
  redirect(`/character/select?storyId=${params.id}`);
}