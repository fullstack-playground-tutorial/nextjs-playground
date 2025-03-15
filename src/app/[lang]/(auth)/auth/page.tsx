import { SignInForm } from "./components/signin";
interface Props {
  params: { language: string };
}
export default function Page({ params }: Props) {
  return <SignInForm params={params} />;
}
