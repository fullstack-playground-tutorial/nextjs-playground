export type PassBook = {
  id: string;
  name: string;
  deposit: number;
  currency: string;
  savingTerm: string;
  interest: number;
  interestPenalty: number;
  status: string;
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
