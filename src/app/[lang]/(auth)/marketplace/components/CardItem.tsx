interface Props {
  name: string;
  description: string;
  price: string;
  imageURL: string;
}
export default function CardItem({
  name,
  description,
  imageURL,
  price,
}: Props) {
  return (
    <div className="flex flex-col rounded-lg shadow-lg bg-white max-h-[480px] max-w-[400px] gap-2 border-2">
      <div className="flex gap-4 basis-3/4 flex-row p-2">
        <img
          className="rounded object-cover shadow-md"
          src={imageURL}
          alt={name}
        />
        <div className="flex flex-col overflow-hidden justify-between text-gray-950">
          <div className="basis-2/4">
            <p className="font-semibold">{name}</p>
            <span className="line-clamp-3">{description}</span>
          </div>
          <p className="basis-1/4 flex items-center justify-center text-lg text-green-primary-bg">{price}</p>
          <button className="m-auto btn btn-md btn-outline-primary">
            Add To Cart
          </button>
        </div>
      </div>
      <div className="flex basis-1/4 flex-row gap-10 justify-center text-black p-2 border-t border-gray-300">
        <span>10k view</span>
        <span>10k buy</span>
        <span>10k love</span>
      </div>
    </div>
  );
}
