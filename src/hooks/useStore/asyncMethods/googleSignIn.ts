import { StoreCtx } from "../useStore";

export async function googleSignIn(this: StoreCtx) {
  if (this.getState().googleTokenClient.isIdle()) {
    await this.getState().googleTokenClient.executeAsync();
  }

  const tokenCLient = this.getState().googleTokenClient.get();

  const tokens = await authorizeApi(tokenCLient);
  this.getState().setGoogleTokens(tokens);
}

async function authorizeApi(tokenClient: google.accounts.oauth2.TokenClient) {
  const result = new Promise<GoogleApiOAuth2TokenObject>((resolve, reject) => {
    // @ts-expect-error: Using example from documentation. https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-asyncawait
    tokenClient.callback = (resp) => {
      console.log(resp.error);

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
