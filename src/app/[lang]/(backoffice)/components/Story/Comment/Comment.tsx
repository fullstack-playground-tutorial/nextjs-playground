import { Comment } from "@/app/feature/story";

export interface Props {
  comment: Comment;
}

export const CommentComponent = ({ comment }: Props) => {
  const avatarDefault =
    "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg";
  return (
    <>
      <div className="flex flex-shrink-0 shadow-md items-center justify-center h-12 w-12 rounded-full bg-glass-200 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
        <img
          className="h-full w-full rounded-full border-2 border-white"
          src={comment.owner.avatarURL ?? avatarDefault}
          alt={comment.owner.username}
          srcSet={avatarDefault ?? avatarDefault}
        />
      </div>

      <div className=" text-black inline-flex flex-col bg-glass-300 rounded-lg p-2 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
        <label htmlFor="" className="font-bold">
          {comment.owner.username}
        </label>
        <span className="">{comment.comment}</span>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-yellow-300 shadow-md"></div>
            <span className="">{comment.emotions.happy.total}</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-blue-300 shadow-md"></div>
            <span>{comment.emotions.cry.total}</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-green-300 shadow-md"></div>
            <span>{comment.emotions.angry.total}</span>
          </div>
        </div>
      </div>
    </>
  );
};
