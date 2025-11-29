import { HTTPService } from "@/app/utils/http";
import { createCRUDService, CRUDService } from "@/app/utils/service";
import { Deposit, PassBook, PFAccount, Withdraw } from "./personal-finance";

export interface PersonalFinanceService {
  Load(): Promise<PFAccount>;
  Withdraw(amount: number): Promise<number>;
  Deposit(amount: number): Promise<number>;
}

export const createPersonalFinanceService = (
  httpService: HTTPService,
  url: string
): PersonalFinanceService => {
  return {
    Load: () =>
      httpService
        .get<PFAccount>(url, {
          next: { tags: ["personal-finance"], revalidate: 60 },
          authSkip: false,
        })
        .then((res) => res.body),
    Withdraw: (amount: number) =>
      httpService
        .post<number, Withdraw>(
          url + "/withdraw",
          {
            amount,
          },
          {
            authSkip: false,
          }
        )
        .then((res) => res.body),
    Deposit: (amount: number) =>
      httpService
        .post<number, Deposit>(
          url + "/deposit",
          {
            amount,
          },
          {
            authSkip: false,
          }
        )
        .then((res) => res.body),
  };
};

export interface PFPassbookService extends CRUDService<PassBook, "id"> {}

export const createPFPassbookService = (
  httpService: HTTPService,
  url: string
): PFPassbookService => {
  return createCRUDService<PassBook, "id">(httpService, url);
};
