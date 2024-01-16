import { LocalStorageCache } from "../../utils/LocalStorageCache";
import type { MonobankApiFacadeContext } from "./useMonobankApiFacade";

export type Account = {
  id: string;
  sendId: string;
  balance: number;
  creditLimit: number;
  type: string;
  currencyCode: number;
  cashbackType: string;
  maskedPan: string[];
  iban: string;
};

export type Jar = {
  id: string;
  sendId: string;
  title: string;
  description: string;
  currencyCode: number;
  balance: number;
  goal: number;
};

export type ClientInfo = {
  clientId: string;
  name: string;
  webHookUrl: string;
  permissions: string;
  accounts: Account[];
  jars: Jar[];
};

const clientInfoCache = new LocalStorageCache<{ clientInfo: ClientInfo; apiKey: string }>('client-info-cache');

export async function getClientInfo(this: MonobankApiFacadeContext) {
  const cached = clientInfoCache.get();

  if (cached && cached.apiKey === this.apiKey) {
    return cached.clientInfo
  }

  const response = await fetch(
    `https://no-cors.t-a-kvlnk.workers.dev/?uri=${encodeURIComponent(`https://api.monobank.ua/personal/client-info`)}`,
    {
      headers: {
        "X-Token": this.apiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const clientInfo = await response.json() as ClientInfo;

  clientInfoCache.set({
    apiKey: this.apiKey,
    clientInfo,
  });

  return clientInfo;
}
