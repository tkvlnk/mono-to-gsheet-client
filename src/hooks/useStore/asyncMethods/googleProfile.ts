import { StoreCtx } from "../useStore";

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

export async function googleProfile(this: StoreCtx) {
  const { access_token } = this.getState().googleTokens ?? {};

  if (!access_token) {
    throw new Error("No google access token");
  }

  const res = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!res.ok) {
    this.getState().setGoogleTokens(null);
    this.getState().googleSignIn.reset();
    throw new Error("Profile request failed");
  }

  return res.json() as Promise<GoogleUserProfile>;
}
