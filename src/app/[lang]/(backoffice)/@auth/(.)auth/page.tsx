import Modal from "@/components/Modal";
import { SignInForm } from "../../../(auth)/auth/components/signin";

export default function Page(params: { language: string }) {
  return (
    <Modal>
      <div className="flex justify-center items-center">
        <SignInForm params={params} modal={true}/>
      </div>
    </Modal>
  );
}
