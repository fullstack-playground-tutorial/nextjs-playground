export default function Sidebar() {
  return (
    <>
      <section className="sticky top-24 md:flex flex-col w-48 justify-start gap-4 sm:hidden h-full">
        <div className="p-4 shadow-md text-white flex flex-col gap-4 backdrop-blur-md bg-[--color-glass-100] rounded-lg">
          <div className="text-center flex flex-col gap-4 ">
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
          </div>
        </div>
        <div className=" shadow-md p-4 text-white flex flex-col gap-4 backdrop-blur-md bg-[--color-glass-100] rounded-lg">
          <div className="text-center flex flex-col gap-4">
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
            <div className="py-2 rounded-full border shadow-md hover:bg-blue-400">
              Profile
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
