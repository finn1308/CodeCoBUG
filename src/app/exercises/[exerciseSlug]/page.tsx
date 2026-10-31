import { notFound } from 'next/navigation';
import { getExerciseBySlug, getAllExercises } from '@/lib/fixtures/sampleCurriculum';
import { ExerciseWorkspace } from '@/components/workspace/ExerciseWorkspace';

interface ExercisePageProps {
  params: Promise<{
    exerciseSlug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllExercises().map((item) => ({
    exerciseSlug: item.exercise.slug,
  }));
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
      lesson={match.lesson}
      topicTitle={match.topic.title}
    />
  );
}
