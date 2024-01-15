import constate from "constate";
import { useAsync } from "../useAsync";
import { getClientInfo } from "./getClientInfo";
import { getStatements } from "./getStatements";
import { useRef } from "react";

export type MonobankApiFacadeContext = { apiKey: string };

export const [MonobankApiFacadeProvider, useMonobankApiFacade] = constate(() => {
  const apiKey = useRef<string | null>(null);
  
  const sharedContext = {
    get apiKey() {
      if (!apiKey.current) {
        throw new Error('apiKey is not defined');
      }
      return apiKey.current;
    }
  }
  
  return {
    clientInfo: useAsync(getClientInfo.bind(sharedContext)),
    getStatements: useAsync(getStatements.bind(sharedContext)),
    updateApiKey: (newApiKey: string) => {
      apiKey.current = newApiKey;
    },
  };
});


