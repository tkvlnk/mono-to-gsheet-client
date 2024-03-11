import { authCache } from "../authCache";
import { StoreCtx } from "../useStore";

export async function googleSignIn(this: StoreCtx, { cacheOnly = false } = {}) {
  if (this.getState().googleTokenClient.isIdle()) {
    await this.getState().googleTokenClient.executeAsync();
  }
  
  const cachedTokens = authCache.get();

  if (cachedTokens) {
    gapi.client.setToken(cachedTokens);
    return cachedTokens;
  } else if (cacheOnly) {
    throw new Error("No cached tokens");
  }

  const tokens = await authorizeApi(this.getState().googleTokenClient.get());
  authCache.set(tokens);
  return tokens;
}

async function authorizeApi(tokenClient: google.accounts.oauth2.TokenClient) {
  const result = new Promise<GoogleApiOAuth2TokenObject>((resolve, reject) => {
    // @ts-expect-error: Using example from documentation. https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-asyncawait
    tokenClient.callback = (resp) => {
      if (resp.error !== undefined) {
        reject(resp);
        return;
      }

      resolve(gapi.client.getToken());
    };
  });

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "" });
  } else {
    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  return result;
}
