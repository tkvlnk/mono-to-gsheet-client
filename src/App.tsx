import { useEffect, useState } from 'react'
import './App.css';

const CLIENT_ID = '905474591291-suogt2amt9sqlop15te377an0ugbc7f9.apps.googleusercontent.com';

function App() {
  const [authToken] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('access_token'))
  const [isReady, setIsReady] = useState(false)
  const [googleUser, setGoogleUser] = useState<null | unknown>(null)

  useEffect(() => {
    if (!authToken) {
      setIsReady(true);
      return;
    }

    
    fetchGoogleUser(authToken).then(setGoogleUser).finally(() => setIsReady(true));
  }, [authToken])

  if (!isReady) return <div>Loading...</div>;

  if (googleUser) {
    return (
      <div>
      <code>{JSON.stringify(googleUser, null, 2)}</code>
      <button onClick={async () => {
        await (await gSheetsClient).spreadsheets.values.update({
          access_token: authToken!,
          spreadsheetId: '1TcpjYSMU6_AegrKyCfYJvcuTcWdzEKT1dHpgScGEo2Q',
          range: 'WebDemo!C5',
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [['hello world1111']]
          }
        });

        alert('done');
      }}>edit table</button>
      </div>
    )
  }

  return (
    <button onClick={authorizeGoogle}>
      Sign in via google
    </button>
  )
}

export default App

function authorizeGoogle() {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('scope', ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '));
  url.searchParams.append('client_id', CLIENT_ID);
  url.searchParams.append('redirect_uri', 'https://localhost:3000');
  url.searchParams.append('response_type', 'token');

  window.location.href = url.toString()
}

async function fetchGoogleUser(authToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return res.json();
}

const gSheetsClient = new Promise<typeof gapi.client.sheets>((resolve) => {
  
  gapi.load('client:auth2', initClient);

  async function initClient() {
    console.log('initClient');

    await gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4');

    console.log('shhets', (gapi.client).sheets)

    resolve((gapi.client).sheets);
  }
})
