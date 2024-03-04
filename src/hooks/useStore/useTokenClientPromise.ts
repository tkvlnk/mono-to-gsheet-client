import { useState } from "react";
import { useAppendScript } from "../useAppendScript";

export function useTokenClientPromise() {
  const gapiReady = useAppendScript("https://apis.google.com/js/api.js");
  const gsiReady = useAppendScript("https://accounts.google.com/gsi/client");

  const [tokenClientPromise] = useState(async () => {
    const [tokenClient] = await Promise.all([
      prepareGsi(gsiReady),
      prepareGapi(gapiReady),
    ]);

    return tokenClient;
  });

  return tokenClientPromise;
}

async function prepareGapi(gapiReady: Promise<void>) {
  await gapiReady;
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

const CLIENT_ID =
  "905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com";

async function prepareGsi(gsiReady: Promise<void>) {
  await gsiReady;

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
