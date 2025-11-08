import BinIcon from "@/assets/images/icons/bin.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
interface Props {
  id: string;
  title: string;
  slug: string;
  description: string;
  count: number;
  tagColor?: string; // rgb, hex, hsl...
  onDelete: () => void;
  onEdit: () => void;
}
function Card({
  title,
  description,
  count,
  slug,
  tagColor,
  onDelete,
  onEdit,
}: Props) {
  const truncate = (str: string, max: number) => {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  };
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-2 xl:w-70 xl:h-42 max-h-42 h-auto md:w-65 w-full p-4 rounded-xl shadow-sm hover:shadow-md dark:bg-surface-1 border border-border">
        <h3 className="text-base font-semibold dark:text-primary">
          {title}{" "}
          <span
            className={`text-xs font-normal dark:text-white dark:bg-surface-4 rounded px-1`}
            style={{ backgroundColor: tagColor }}
          >
            {slug}
          </span>{" "}
          {"("}
          <span className="text-xs font-normal dark:text-secondary">
            {count} 📄
          </span>
          {")"}
        </h3>
        <p className="text-sm font-normal dark:text-secondary h-full w-full text-justify overflow-hidden">
          {truncate(description, 80)}
        </p>
        <div className="flex justify-end gap-3 mt-3 text-sm">
          <button
            className="dark:text-primary hover:underline cursor-pointer outline-none"
            onClick={onEdit}
          >
            <EditIcon className="size-4 dark:fill-secondary hover:fill-primary transition-all dark:hover:scale-120"/>
          </button>
          <button
            className=" cursor-pointer outline-none"
            onClick={onDelete}
          >
            <BinIcon className="size-4  dark:fill-alert-0 dark:hover:fill-alert-1 transition-all dark:hover:scale-120"/>
          </button>
        </div>
      </div>
    </>
  );
}

export default Card;
