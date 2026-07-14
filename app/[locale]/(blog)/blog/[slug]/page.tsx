type Props = {
  params: Promise<{slug: string}>;
};

export default async function BlogSlugPage({params}: Props) {
  const {slug} = await params;
  return <div>Blog: {slug}</div>;
}
