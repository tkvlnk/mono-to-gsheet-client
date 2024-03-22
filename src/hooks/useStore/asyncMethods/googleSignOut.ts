import { StoreCtx } from "../useStore";

export async function googleSignOut(this: StoreCtx) {
  const { access_token } = this.getState().googleTokens ?? {};

  if (access_token) {
    await new Promise<void>((resolve) => {
      window.google.accounts.oauth2.revoke(access_token, resolve);
    });
  }

  this.getState().setGoogleTokens(null);
  window.gapi.client.setToken(null);
  this.getState().googleProfile.reset();
}
