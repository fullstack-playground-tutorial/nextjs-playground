export default function searchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col p-4">{children}</div>;
}
