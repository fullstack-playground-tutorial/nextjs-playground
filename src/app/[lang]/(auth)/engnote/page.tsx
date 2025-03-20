interface Props {
  params: { lang: string };
}
export default function EngNotePage(props: Props) {
  return (
    <>
      <div className="flex justify-center flex-col w-[600px] bg-">
        <h1>English Note</h1>
        <div>
          <input type="text" name="search" />
          <button type="button">search</button>
        </div>
      </div>
    </>
  );
}
