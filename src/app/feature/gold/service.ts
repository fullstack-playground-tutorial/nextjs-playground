import { HTTPService } from "@/app/utils/http";
import { GoldPrice } from "./gold";

export interface GoldService {
  getGoldPrice(type: "sjc" | "doji" | "pnj"): Promise<GoldPrice[]>;
}

export const createGoldService = (
  httpService: HTTPService,
  url: string
): GoldService => {
  const getGoldPrice = async (
    type: "sjc" | "doji" | "pnj"
  ): Promise<GoldPrice[]> => {
    return httpService
      .get<GoldPrice[]>(url + "/" + type, {
        headers: {
          contentType: "application/json",
        },
        next: {
          revalidate: 3600,
          tags: ["gold-price"],
        },
      })
      .then((res) => res.body);
  };
  return {
    getGoldPrice: getGoldPrice,
  };
};
