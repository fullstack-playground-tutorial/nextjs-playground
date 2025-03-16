interface Props {
  name: string;
  description: string;
  price: string;
  imageURL: string;
  quantity: number;
}
export default function CartItem({
  name,
  description,
  imageURL,
  price,
  quantity,
}: Props) {
  return (
    <div className="flex flex-col rounded-[24px] shadow-md bg-white max-h-[480px] max-w-[400px] gap-2">
      <div className="flex gap-4 basis-3/4 flex-row p-2">
        <img
          className="rounded-[16px] object-cover shadow-md"
          src={imageURL}
          alt={name}
        />
        <div className="flex flex-col overflow-hidden justify-between text-gray-950">
          <div className="basis-2/4">
            <p className="font-semibold">{name}</p>
            <span className="line-clamp-3">{description}</span>
          </div>
          <p className="basis-1/4 text-center font-semibold">{price}</p>
        </div>
      </div>
    </div>
  );
}
