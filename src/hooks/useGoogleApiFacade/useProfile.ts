import { useQuery } from "react-query";
import { useGoogleAuth } from "./useGoogleAuth";
import { authCache } from "../useStore/authCache";

export type GoogleUserProfile = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

const GOOGLE_PROFILE_QUERY_KEY = 'GOOGLE_PROFILE';

export function useProfile() {
  const auth = useGoogleAuth();

  return useQuery(
    [GOOGLE_PROFILE_QUERY_KEY, auth.data?.access_token],
    async () => {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${auth.data?.access_token}`,
          },
        }
      );

      if (!res.ok) {
        authCache.clear();
        auth.remove();
        throw new Error("Profile request failed");
      }

      return res.json() as Promise<GoogleUserProfile>;
    },
    {
      enabled: !!auth.data?.access_token,
    }
  );
}
