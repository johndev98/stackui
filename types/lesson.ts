export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  order: number;
  duration?: string;
  isFree?: boolean;
};
