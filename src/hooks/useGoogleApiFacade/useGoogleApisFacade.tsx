import constate from "constate";
import { useState } from "react";
import { useAsync } from "../useAsync";
import { useAppendScript } from "../useAppendScript";
import { LocalStorageCache } from "../../utils/LocalStorageCache";

const CLIENT_ID = '905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com';

type GoogleUserProfile = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

const authCache = new LocalStorageCache<GoogleApiOAuth2TokenObject>('google-auth');

export const [GoogleApisFacadeProvider, useGoogleApisFacade] = constate(() => {
  const gapiReady = useAppendScript('https://apis.google.com/js/api.js');
  const gsiReady = useAppendScript('https://accounts.google.com/gsi/client');

  const [tokenClientPromise] = useState(async () => {
    const [tokenClient] = await Promise.all([
      prepareGsi(gsiReady),
      prepareGapi(gapiReady)
    ]);

    return tokenClient;
  });

  const auth = useAsync(async (onlyCache: boolean = false) => {
    const tokenClient = await tokenClientPromise;
    const cachedTokens = authCache.get();

    if (cachedTokens) {
      await gapiReady;
      gapi.client.setToken(cachedTokens);
      return cachedTokens;
    } else if (onlyCache) {
      throw new Error('No cached credentials');
    }

    const tokens = await authorizeApi(tokenClient);
    authCache.set(tokens);
    return tokens
  }, {
    autoRunWithParams: [true]
  });

  const profile = useAsync(async () => {
    assertAuthSuccess();

    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${auth.data?.access_token}`
      }
    });

    if (!res.ok) {
      authCache.clear();
      auth.reset();
      throw new Error('Profile request failed');
    }

    return res.json() as Promise<GoogleUserProfile>;
  });

  const updateSheets = useAsync(async ({ range, values, spreadsheetId }: { values: string[][]; spreadsheetId: string; range: string }) => {
    assertAuthSuccess();
    
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values
      }
    })
  });

  return {
    auth,
    profile,
    updateSheets,
    getAccessToken: () => {
      if (!auth.data?.access_token) {
        throw new Error('Access token not found');
      }
      return auth.data?.access_token;
    }
  }

  function assertAuthSuccess() {
    if (auth.status !== 'success') {
      throw new Error('Need authorize first');
    }
  }
});

async function prepareGapi(gapiReady: Promise<void>) {
  await gapiReady;
  await Promise.all([
    new Promise((resolve, reject) => {
      gapi.load('client', { callback: resolve, onerror: reject });
    }),
    new Promise((resolve, reject) => {
      gapi.load('picker', { callback: resolve, onerror: reject });
    }),
  ]);
  await gapi.client.init({
    discoveryDocs: [
      'https://sheets.googleapis.com/$discovery/rest?version=v4', 
      'https://www.googleapis.com/discovery/v1/apis/people/v1/rest'
    ],
  });
}

async function prepareGsi(gsiReady: Promise<void>) {
  await gsiReady;
  
  return window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly'
    ].join(' '),
    prompt: 'consent',
    // @ts-expect-error: Using example from documentation. https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-asyncawait
    callback: '',  // defined at request time in await/promise scope.
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

      resolve(gapi.client.getToken())
    }
  });

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: '' });
  } else {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  return result
}
