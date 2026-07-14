type Props = {
  params: Promise<{slug: string}>;
};

export default async function CourseSlugPage({params}: Props) {
  const {slug} = await params;
  return <div>Course: {slug}</div>;
}
