"use server";

import {
  getPersonalFinanceService,
  getPFPassbookService,
} from "@/app/core/server/context";
import { updateTag } from "next/cache";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";

export const depositAction = async (amount: number) => {
  return getPersonalFinanceService()
    .Deposit(amount)
    .then((res) => {
      updateTag("personal-finance");
      return res;
    });
};

export const withdrawAction = async (amount: number) => {
  return getPersonalFinanceService()
    .Withdraw(amount)
    .then(async (res) => {
      updateTag("personal-finance");
      return res;
    });
};

export const createPassbook = async (
  name: string,
  deposit: number,
  currency: string,
  interest: number,
  interestPenalty: number,
  estimateMoney: number,
  startDate: Date,
  dueDate: Date
) => {
  const startDateStr = startDate.toLocaleString("en-US");
  const dueDateStr = dueDate.toLocaleString("en-US");
  const errs = InputValidate.object({
    name: createSchemaItem("name").isRequired("Title is required"),
    deposit: createSchemaItem("deposit").isRequired("Deposit is required"),
    currency: createSchemaItem("currency").isRequired("Currency is required"),
    interest: createSchemaItem("interest")
      .isRequired("Interest is required")
      .hasMin(0.1),
    interestPenalty: createSchemaItem("interestPenalty")
      .isRequired("Interest penalty is required")
      .hasMin(0),
    estimateMoney: createSchemaItem("estimateMoney")
      .isRequired("Estimate money is required")
      .hasMin(0),
    startDate: createSchemaItem("startDate").isRequired(
      "Start date is required"
    ),
    dueDate: createSchemaItem("dueDate").isRequired("Due date is required"),
  }).validate({
    name,
    deposit,
    currency,
    interest,
    interestPenalty,
    estimateMoney,
    startDate: startDateStr,
    dueDate: dueDateStr,
  });

  if (JSON.stringify(errs) !== "{}") {
    return { fieldErrors: errs, result: null };
  }

  return getPFPassbookService()
    .create({
      name,
      deposit,
      currency,
      interest,
      interestPenalty,
      estimateMoney,
      startDate,
      dueDate,
      status: "progress",
    })
    .then((res) => {
      updateTag("passbooks");
      updateTag("personal-finance");
      return { result: res, fieldErrors: undefined };
    });
};

export const withdrawPassbook = async (passbookId: string) => {
  return getPFPassbookService()
    .Withdraw(passbookId)
    .then((res) => {
      updateTag("passbooks");
      updateTag("personal-finance");
      return res;
    });
};
