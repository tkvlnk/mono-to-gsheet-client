import { LocalStorageCache } from "../../../utils/LocalStorageCache";
import { StoreCtx } from "../useStore";

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

export function monoClientInfo(
  this: StoreCtx
) {
  return getClientInfo({  monoAuthToken: this.getState().getMonoAuthToken() });
}

async function getClientInfo({ monoAuthToken }: { monoAuthToken: string }) {
  const cached = clientInfoCache.get();

  if (cached && cached.apiKey === monoAuthToken) {
    return cached.clientInfo;
  }

  const response = await fetch(
    `https://api.monobank.ua/personal/client-info`,
    {
      headers: {
        "X-Token": monoAuthToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const clientInfo = (await response.json()) as ClientInfo;

  clientInfoCache.set({
    apiKey: monoAuthToken,
    clientInfo,
  });

  return clientInfo;
}
