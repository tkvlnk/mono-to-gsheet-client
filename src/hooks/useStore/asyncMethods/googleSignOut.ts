import { authCache } from "../authCache";
import { StoreCtx } from "../useStore";

export async function googleSignOut(this: StoreCtx) {
  const {access_token} = this.getState().googleSignIn.get();

  await new Promise<void>((resolve) => {
    window.google.accounts.oauth2.revoke(access_token, resolve);
  });

  authCache.clear();
  window.gapi.client.setToken(null);
  this.getState().googleProfile.reset();
}
