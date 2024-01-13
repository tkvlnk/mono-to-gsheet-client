import constate from "constate";
import { useAsync } from "../useAsync";
import { getClientInfo } from "./getClientInfo";
import { getStatements } from "./getStatements";
import { useState } from "react";

export type MonobankApiFacadeContext = { apiKey: string };

export const [MonobankApiFacadeProvider, useMonobankApiFacade] = constate(() => {
  const [apiKey, setApiKey] = useState(null as string | null);
  
  const sharedContext = {
    get apiKey() {
      if (!apiKey) {
        throw new Error('apiKey is not defined');
      }
      return apiKey;
    }
  }
  
  return {
    clientInfo: useAsync(getClientInfo.bind(sharedContext)),
    getStatements: useAsync(getStatements.bind(sharedContext)),
    updateApiKey: (newApiKey: string) => setApiKey(newApiKey),
  };
});


