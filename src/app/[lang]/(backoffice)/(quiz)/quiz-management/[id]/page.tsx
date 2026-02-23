import { getQuizService } from "@/app/core/server/context";

type Props = {
    params: Promise<{ id: string }>;
};
export default async function Page(props: Props) {
    const params = await props.params;
    const id = params.id;
    const quiz = await getQuizService().load(id);
    return <div>Quiz Management Page {id}</div>;
}