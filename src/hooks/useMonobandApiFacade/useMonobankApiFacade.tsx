import { useMutation } from "react-query";
import { useStore } from "../useStore/useStore";

export type MonobankApiFacadeContext = { apiKey: string };

export function useMonobankApiFacade() {
  const updateApiKey = useStore(s => s.setMonoAuthToken);
  const getClientInfo = useStore(s => s.getClientInfo);
  const getStatements = useStore(s => s.getStatements);

  return {
    clientInfo: useMutation(getClientInfo),
    getStatements: useMutation(getStatements),
    updateApiKey,
  };
}
