interface Props {
  params: { language: string; id: string };
}
export default function ProductDetailPage(props: Props) {
  return (
    <>
      <div className="product-detail flex flex-col h-150 items-center">
        <div>breadcrumb</div>
        <div className="flex flex-col basis-2/3 rounded-2xl bg-color-app-2"></div>
        <div className="basis-1/3"></div>
      </div>
    </>
  );
}
