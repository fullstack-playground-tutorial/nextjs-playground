export default function SkeletonWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative  overflow-hidden dark:bg-[#444] ${
        className ? className.toString() : ""
      } w-full h-full`}
    >
      {children}
    </div>
  );
}
