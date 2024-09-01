
export const StoryPost = () => {
  return (
    <div className="flex gap-4 flex-row min-w-[400px] blur-0 relative w-1/2 mx-auto bg-[--color-glass-100] rounded-lg p-4 shadow-lg border border-l-[--color-glass-500] backdrop-blur-lg border-t-[--color-glass-500] border-r-[--color-glass-200] border-b-[--color-glass-200]">
      <div className="flex shadow-md items-center justify-center h-10 w-10 rounded-full bg-[--color-glass-200] border border-t-[--color-glass-500] border-l-[--color-glass-500] border-r-[--color-glass-200] border-b-[--color-glass-200]">
        <img
          className="h-full w-full rounded-full border-2 border-white"
          src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          alt=""
          srcSet="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <textarea
          placeholder="Need to share ?"
          className="p-1 bg-white outline-none min-h-[64px] shadow-md resize-none overflow-hidden placeholder-gray-400 text-sm flex-1 bg-[--color-glass-200] border-t-[--color-glass-500] border-l-[--color-glass-500] border-r-[--color-glass-200] border-b-[--color-glass-200] border tracking-wide rounded-md"
        />
        <div className="flex flex-row gap-1">
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
        </div>
        <button
          type="button"
          className="  bg-white rounded-full text-blue-400 py-1 px-2 shadow-md text-sm self-end font-bold"
        >
          Post
        </button>
        
      </div>
    </div>
  );
};
