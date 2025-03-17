import { Product } from "@/app/feature/market/market";

interface Props {
  params: { language: string };
}
export default function ShoppingCartPage(props: Props) {
  const products: Product[] = [
    {
      id: "1",
      name: "Iphone 17 Air",
      price: 10.99,
      imgURL:
        "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/iPhone-17-air-render-zellzoi.png",
      quantity: 1,
    },
    {
      id: "2",
      name: "Iphone 17 Air",
      price: 12,
      imgURL:
        "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/iPhone-17-air-render-zellzoi.png",
      quantity: 10,
    },
  ];
  return (
    <div className="flex flex-col w-full items-center">
      <table className="mt-4 w-1/2 rounded-lg text-center overflow-hidden table-auto">
        <caption>YOUR SHOPPING CART</caption>

        <thead className="bg-[--background-black-400]">
          <tr>
            <th className="border border-[--background-black-200] p-2">#</th>
            <th className="border border-[--background-black-200] p-2">
              image
            </th>
            <th className="border border-[--background-black-200] p-2">name</th>
            <th className="border border-[--background-black-200] p-2">
              price
            </th>
            <th className="border border-[--background-black-200] p-2">
              quantity
            </th>
          </tr>
        </thead>
        <tbody className="bg-[--background-black-300] ">
          {products.map(({ id, imgURL, name, price, quantity }) => (
            <tr key={id}>
              <td className="border-b border-[--background-black-200] p-2">
                {id}
              </td>
              <td className="border-b border-[--background-black-200] p-2">
                <img
                  className="rounded-[16px] object-cover shadow-md size-[160px] mx-auto"
                  src={imgURL}
                  alt={name}
                />
              </td>
              <td className="border-b border-[--background-black-200] p-2">
                <p>{name}</p>
              </td>
              <td className="border-b border-[--background-black-200] p-2">
                <p>{price}</p>
              </td>
              <td className="border-b border-[--background-black-200] p-2">
                {quantity}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-[--background-black-300] ">
          <tr>
            <td colSpan={6}>
              <div className="flex justify-between p-2 w-full">
                <span className="">TOTAL:</span>
                <span className="">8000000 VND</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
