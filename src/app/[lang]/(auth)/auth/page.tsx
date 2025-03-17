import { SignInForm } from "./components/signin";
interface Props {
  params: { language: string };
}
export default function Page({ params }: Props) {
  return (
    <div className="flex items-center justify-center flex-col">
      <SignInForm params={params} />
    </div>
  );
}
