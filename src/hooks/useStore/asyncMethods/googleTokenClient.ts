import { appendScript } from "../../../utils/appendScript";
import { StoreCtx } from "../useStore";

export async function googleTokenClient(this: StoreCtx) {
  const [tokenClient] = await Promise.all([
    appendScript("https://accounts.google.com/gsi/client").then(prepareGsi),
    appendScript("https://apis.google.com/js/api.js").then(prepareGapi),
  ]);

  const cachedTokens = this.getState().googleTokens;

  if (cachedTokens) {
    window.gapi.client.setToken(cachedTokens);
  }

  return tokenClient;
}

const CLIENT_ID =
  "905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com";

async function prepareGapi() {
  await Promise.all([
    new Promise((callback, onerror) => {
      gapi.load("client", { callback, onerror });
    }),
    new Promise((callback, onerror) => {
      gapi.load("picker", { callback, onerror });
    }),
  ]);
  await gapi.client.init({
    discoveryDocs: [
      "https://sheets.googleapis.com/$discovery/rest?version=v4",
      "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
    ],
  });
}

async function prepareGsi() {
  return window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.readonly",
    ].join(" "),
    prompt: "consent",
    // @ts-expect-error: Using example from documentation. https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-asyncawait
    callback: "", // defined at request time in await/promise scope.
  });
}
