import { useGoogleAuth } from "./useGoogleAuth";
import { useProfile } from "./useProfile";
import { useUpdateSheets } from "./useUpdateSheets";

export function useGoogleApisFacade() {
  const auth = useGoogleAuth();

  return {
    auth: useGoogleAuth(),
    profile: useProfile(),
    updateSheets: useUpdateSheets(),
    getAccessToken: () => {
      if (!auth.data?.access_token) {
        throw new Error('Access token not found');
      }
      return auth.data?.access_token;
    }
  }
}
