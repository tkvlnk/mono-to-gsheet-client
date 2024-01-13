import constate from "constate";
import { useState } from "react";
import { useAsync } from "../useAsync";
import { useAppendScript } from "../useAppendScript";

const CLIENT_ID = '905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com';

type Prompt = '' | 'none' | 'consent' | 'select_account';

type InitTokenClientConfig = {
  client_id: string;
  scope: string;
  callback: '' | (() => void);
  prompt: Prompt;
}

type TokenClient = {
  callback: (resp: { error?: unknown }) => void;
  requestAccessToken: (params: { prompt: '' | 'none' | 'consent' | 'select_account' }) => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: InitTokenClientConfig) => TokenClient;
        };
      };
    };
  }
}

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

  const auth = useAsync(() => authorizeApi(tokenClientPromise));
  
  const profile = useAsync(async () => {
    assertAuthSuccess();

    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${auth.data?.access_token}`
      }
    });

    return res.json();
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
  }

  function assertAuthSuccess() {
    if (auth.status !== 'success') {
      throw new Error('Need authorize first');
    }
  }
});

async function prepareGapi(gapiReady: Promise<void>) {
  await gapiReady;
  console.log('gapiReady')
  await new Promise((resolve, reject) => {
    gapi.load('client', { callback: resolve, onerror: reject });
  });
  await gapi.client.init({
    discoveryDocs: [
      'https://sheets.googleapis.com/$discovery/rest?version=v4', 
      'https://www.googleapis.com/discovery/v1/apis/people/v1/rest'
    ],
  });
}

async function prepareGsi(gsiReady: Promise<void>) {
  await gsiReady;
  console.log('gapiReady')
  return new Promise<TokenClient>((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ].join(' '),
        prompt: 'consent',
        callback: '',  // defined at request time in await/promise scope.
      })

      resolve(tokenClient);
    } catch (err) {
      reject(err);
    }
  });
}

async function authorizeApi(tokenClientPromise: Promise<TokenClient>) {
  const tokenClient = await tokenClientPromise;

  const result = new Promise<GoogleApiOAuth2TokenObject>((resolve, reject) => {
    tokenClient.callback = (resp) => {
      if (resp.error !== undefined) {
        reject(resp);
        return;
      }
      console.log('gapi.client access token: ' + JSON.stringify(gapi.client.getToken()));

      resolve(gapi.client.getToken())
    }
  });

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and asked for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: '' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }

  return result
}
