import { notFound } from 'next/navigation';
import { getExerciseBySlug } from '@/lib/fixtures/sampleCurriculum';
import { ExerciseWorkspace } from '@/components/workspace/ExerciseWorkspace';

interface ExercisePageProps {
  params: Promise<{
    exerciseSlug: string;
  }>;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { exerciseSlug } = await params;
  const match = getExerciseBySlug(exerciseSlug);

  if (!match) {
    notFound();
  }

  return (
    <ExerciseWorkspace
      exercise={match.exercise}
      topicTitle={match.topic.title}
    />
  );
}
