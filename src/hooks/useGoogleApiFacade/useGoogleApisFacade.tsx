import { useMutation } from "react-query";
import { useGoogleAuth } from "./useGoogleAuth";
import { useProfile } from "./useProfile";
import { useStore } from "../useStore/useStore";

export function useGoogleApisFacade() {
  const auth = useGoogleAuth();
  const writeStatementsToSheet = useStore(s => s.writeStatementsToSheet);

  return {
    auth: useGoogleAuth(),
    profile: useProfile(),
    updateSheets: useMutation('updateSheets', writeStatementsToSheet),
    getAccessToken: () => {
      if (!auth.data?.access_token) {
        throw new Error('Access token not found');
      }
      return auth.data?.access_token;
    }
  }
}
