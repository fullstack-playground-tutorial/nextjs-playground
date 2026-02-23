import { Suspense } from "react";
import DeleteForm from "@/app/[lang]/(backoffice)/(quiz)/quiz-management/components/DeleteForm";
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
        <Suspense fallback={<div>Loading...</div>}>
            <Modal>
                <DeleteForm id={id} />
            </Modal>
        </Suspense>
    );
}
