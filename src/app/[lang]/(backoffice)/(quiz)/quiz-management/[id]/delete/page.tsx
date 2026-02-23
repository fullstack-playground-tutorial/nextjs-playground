import { Suspense } from "react";
import DeleteForm from "../../components/DeleteForm";

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
            <DeleteForm id={id} />
        </Suspense>
    );
}

