import DeleteForm from "../../components/DeleteForm";

export default async function Page({
  params,
}: {
  params: Promise<{
    action: string;
    id: string;
  }>;
}) {
  const { id } = await params;
  return <DeleteForm id={id} />;

}
