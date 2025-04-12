import { Vocabulary } from "@/app/feature/english-note/english-note";

type Props = {
  searchedWord?: Vocabulary;
};
function WordDetail({ searchedWord }: Props) {
  return (
    <>
      {searchedWord && (
        <div className="w-[800px] bg-layer-2 shadow rounded-md p-4">
          <h1 className="self-center font-semibold text-2xl text-center">
            {searchedWord.word}
          </h1>
          <div>
            <p className="text-sm">{searchedWord.definition}</p>
            <br />
            <span className="italic text-sm">
              {`Bạn đã search từ này ${searchedWord.searchCount} lần!`}{" "}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default WordDetail;
