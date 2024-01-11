import { useEffect } from "react";
import { GoogleApisFacadeProvider, useGoogleApisFacade } from "./components/GoogleApisFacade";

export default function App() {
  return <GoogleApisFacadeProvider>
    <GoogleSignInBar />
  </GoogleApisFacadeProvider>
}

const GoogleSignInBar = () => {
  const {auth, profile} = useGoogleApisFacade();

  useEffect(() => {
    if (auth.state === 'success') {
      profile.execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.state]);

  if (auth.state !== 'success') {
    if (auth.state === 'pending') {
      return <div>Signing in...</div>;
    }

    if (auth.state === 'error') {
      return <div>Sign in failed: {auth.error}</div>;
    }
    return <button onClick={auth.execute}>Sign in via google</button>;
  }

  if (profile.state === 'pending') {
    return <div>Fetching profile...</div>;
  }

  if (profile.state === 'success') {
    return <pre>{JSON.stringify(profile.data, null, 2)}</pre>;
  }
}
