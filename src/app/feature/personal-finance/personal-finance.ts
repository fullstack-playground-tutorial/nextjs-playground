export type PassBook = {
  id: string;
  name: string;
  deposit: number;
  currency: string;
  interest: number;
  interestPenalty: number;
  estimateMoney: number;
  status: string;
  startDate: Date;
  dueDate: Date;
};

export type PFAccount = {
  userId: string;
  walletMoney: number;
  investMoney: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Withdraw = {
  amount: number;
};

export type Deposit = {
  amount: number;
};
