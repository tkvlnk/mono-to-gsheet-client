import { authCache } from "../authCache";
import { StoreCtx } from "../useStore";

export async function googleAuthTokens(this: StoreCtx) {
  const cachedTokens = authCache.get();

  if (cachedTokens) {
    return cachedTokens;
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
