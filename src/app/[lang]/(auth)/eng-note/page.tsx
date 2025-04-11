"use server";
import { getEnglishNoteService } from "@/app/core/server/context";
import { SearchFrom } from "./components/search-form";

interface Props {
  params: { lang: string };
}

export default async function EngNotePage(props: Props) {

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <SearchFrom />
    </div>
  );
}
