import Link from "next/link";

interface Props {
  id: string;
  name: string;
  description: string;
  price: string;
  imageURL: string;
}
export default function CardItem({
  id,
  name,
  description,
  imageURL,
  price,
}: Props) {
  return (
    <div className="flex flex-col shadow-lg bg-color-app-2 max-h-[480px] max-w-[400px] gap-2">
      <div className="flex gap-4 basis-3/4 flex-col">
        <Link
          className="relative group overflow-hidden"
          href={{
            pathname: `/marketplace/${id}`,
          }}
        >
          <img
            className="rounded object-cover shadow-md w-full group-hover:scale-150 group-hover:rotate-4 transition duration-300"
            src={imageURL}
            alt={name}
          />
          <div className="absolute top-0 bottom-0 bg-red-400 justify-center left-0 right-0 flex items-center w-full text-center font-bold text-4xl opacity-0 group-hover:opacity-60 transition duration-300">
            Add To Cart
          </div>
        </Link>

        <div className="flex flex-col overflow-hidden justify-between p-2">
          <div className="flex basis-2/4 justify-center items-center">
            <p className="font-base">{name}</p>
            {/* <span className="line-clamp-3">{description}</span> */}
          </div>
          <p className="basis-1/4 flex items-center justify-center text-xl font-semibold">
            {price}
          </p>
        </div>
      </div>
      <div className="flex basis-1/4 flex-row gap-10 justify-center p-2 border-t border-gray-300">
        <span>10k view</span>
        <span>10k buy</span>
        <span>10k love</span>
      </div>
    </div>
  );
}
