import { DotLoading } from "@/app/components/DotLoading/DotLoading";
export default function Loading(){
    return <div className="fixed inset-0 z-50">
    <div className="absolute h-full w-full bg-black opacity-50"></div>
    <div className="absolute bottom-[24%] w-full flex items-center justify-center">
      <DotLoading />
    </div>
  </div>
}