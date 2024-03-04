import { useQuery } from "react-query";
import { appendScript } from "../../utils/appendScript";
import { authCache } from "./authCache";

const GOOGLE_TOKENS_CLIENT_QUERY_KEY = "GOOGLE_TOKENS_CLIENT";
const GOOGLE_AUTH_TOKENS_QUERY_KEY = "GOOGLE_AUTH_TOKENS";

export function useGoogleAuth() {
  const tokenClient = useQuery(
    GOOGLE_TOKENS_CLIENT_QUERY_KEY,
    async () => {
      const [tokenClient] = await Promise.all([
        appendScript("https://accounts.google.com/gsi/client").then(prepareGsi),
        appendScript("https://apis.google.com/js/api.js").then(prepareGapi),
      ]);

      return tokenClient;
    },
    {
      cacheTime: Infinity,
    }
  );

  return useQuery(GOOGLE_AUTH_TOKENS_QUERY_KEY, async () => {
    const cachedTokens = authCache.get();

    if (cachedTokens) {
      return cachedTokens;
    }

    const tokens = await authorizeApi(tokenClient.data!);
    authCache.set(tokens);
    return tokens;
  }, {
    enabled: tokenClient.isSuccess,
  });
}

const CLIENT_ID =
  "905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com";

async function prepareGapi() {
  await Promise.all([
    new Promise((resolve, reject) => {
      gapi.load("client", { callback: resolve, onerror: reject });
    }),
    new Promise((resolve, reject) => {
      gapi.load("picker", { callback: resolve, onerror: reject });
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
