import { SignInForm } from "./components/signin";

interface Props {
  params: { language: string };
}
export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col h-screen items-center max-w-300 p-4 mx-auto">
      <div className="mt-12">
        <SignInForm params={params} modal={false} />
      </div>
    </div>
  );
}
