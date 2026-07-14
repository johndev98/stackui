type Props = {
  params: Promise<{slug: string}>;
};

export default async function LearnSlugPage({params}: Props) {
  const {slug} = await params;
  return <div>Learn: {slug}</div>;
}
