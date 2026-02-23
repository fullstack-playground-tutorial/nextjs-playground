import DeleteForm from "../../../components/DeleteForm";
import Modal from "@/components/Modal";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  return (
    <Modal>
      <DeleteForm id={id} />
    </Modal>
  );

}
