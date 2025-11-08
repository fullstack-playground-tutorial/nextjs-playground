import { verifySession } from "@/app/dal";
import { SignInForm } from "./components/signin";
interface Props {
  params: { language: string };
}
export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col h-screen items-center max-w-300 p-4 mx-auto">
      <SignInForm params={params} />
    </div>
  );
}
