"use client";

import Link from "next/link";
import CardItem from "./components/CardItem";

interface Props {
  params: { language: string };
}

export default function MarketPlacePage(props: Props) {
  return (
    <>
      <h1 className="text-center">MarketPlace</h1>
      <div className="flex flex-row justify-normal items-start">
        <Link href={"/marketplace/shopping-cart"} className="btn btn-sm btn-outline-primary">Check Cart?</Link>
      </div>
      <div className="flex flex-row gap-4 flex-wrap pt-4 justify-center">
        <CardItem
          name={"KINGDOM COME"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus est perferendis, hic quidem facilis illum unde rerum ratione. Quibusdam, laboriosam. Animi nulla ad neque consectetur excepturi, mollitia cum culpa officiis"
          }
          price={"10000VND"}
          imageURL={
            "https://fastly.picsum.photos/id/689/200/200.jpg?hmac=2KHWG2UlfLNAWC1jiBz-LQ7b-TMOB4bcW-FVvdQ_7a4"
          }
        />
        <CardItem
          name={"KINGDOM COME"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus est perferendis, hic quidem facilis illum unde rerum ratione. Quibusdam, laboriosam. Animi nulla ad neque consectetur excepturi, mollitia cum culpa officiis"
          }
          price={"10000VND"}
          imageURL={
            "https://fastly.picsum.photos/id/689/200/200.jpg?hmac=2KHWG2UlfLNAWC1jiBz-LQ7b-TMOB4bcW-FVvdQ_7a4"
          }
        />
        <CardItem
          name={"KINGDOM COME"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus est perferendis, hic quidem facilis illum unde rerum ratione. Quibusdam, laboriosam. Animi nulla ad neque consectetur excepturi, mollitia cum culpa officiis"
          }
          price={"10000VND"}
          imageURL={
            "https://fastly.picsum.photos/id/689/200/200.jpg?hmac=2KHWG2UlfLNAWC1jiBz-LQ7b-TMOB4bcW-FVvdQ_7a4"
          }
        />
        <CardItem
          name={"KINGDOM COME"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus est perferendis, hic quidem facilis illum unde rerum ratione. Quibusdam, laboriosam. Animi nulla ad neque consectetur excepturi, mollitia cum culpa officiis"
          }
          price={"10000VND"}
          imageURL={
            "https://fastly.picsum.photos/id/689/200/200.jpg?hmac=2KHWG2UlfLNAWC1jiBz-LQ7b-TMOB4bcW-FVvdQ_7a4"
          }
        />
      </div>
    </>
  );
}
