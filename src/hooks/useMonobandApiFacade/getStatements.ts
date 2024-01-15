import type { MonobankApiFacadeContext } from "./useMonobankApiFacade";

export type Statement = {
  id: string;
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment: string;
  receiptId: string;
  invoiceId: string;
  counterEdrpou: string;
  counterIban: string;
  counterName: string;
};

export async function getStatements(this: MonobankApiFacadeContext, {
  account,
  from,
  to,
}: {
  account: string;
  from: number;
  to?: number;
}) {

  const response = await fetch(
    `https://api.monobank.ua/personal/statement/${account}/${from}${
      to ? `/${to}` : ""
    }}`,
    {
      headers: {
        "X-Token": this.apiKey,
      },
    },
  );
  
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  
  return response.json() as Promise<Statement[]>;
}
