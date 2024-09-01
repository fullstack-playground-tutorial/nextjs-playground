export interface Props {
  content: string;
  media?: "video" | "images";
}

export default function StoryDetailComponent(props: Props) {
  return (
    <div className="text-sm mt-4 tracking-wide ">
      <span className="text-black">{props.content}</span>
      <img src={undefined} alt="" />
    </div>
  );
}
