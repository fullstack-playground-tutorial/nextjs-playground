export default async function Layout({
  children,
  tags,
}: {
  tags: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      {tags}
    </>
  );
}
