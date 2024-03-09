import { StoreCtx } from "../useStore";

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

export async function monoStatements(this: StoreCtx) {
  const { monthIndex, year, account } = this.getState();

  const accountId = account?.id;

  if (!accountId) {
    throw new Error("accountId is not set");
  }

  if (typeof monthIndex === "undefined") {
    throw new Error("monthIndex is not defined");
  }

  if (!year) {
    throw new Error("year is not defined");
  }

  const from = toSeconds(new Date(year, monthIndex, 1));
  const to = toSeconds(new Date(year, monthIndex + 1, 0, 23, 59, -1));

  return getStatements({
    monoAuthToken: this.getState().getMonoAuthToken(),
    accountId,
    from,
    to,
  });
}

function toSeconds(date: Date) {
  return Math.round(date.getTime() / 1000);
}

async function getStatements({
  monoAuthToken,
  accountId,
  from,
  to,
}: {
  monoAuthToken: string;
  accountId: string;
  from: number;
  to?: number;
}) {
  const response = await fetch(
    `https://api.monobank.ua/personal/statement/${accountId}/${from}${
      to ? `/${to}` : ""
    }}`,
    {
      headers: {
        "X-Token": monoAuthToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<Statement[]>;
}
