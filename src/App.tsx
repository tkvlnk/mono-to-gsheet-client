import { useEffect } from "react";
import { GoogleApisFacadeProvider, useGoogleApisFacade } from "./hooks/useGoogleApiFacade/useGoogleApisFacade";

export default function App() {
  return <GoogleApisFacadeProvider>
    <GoogleSignInBar />
  </GoogleApisFacadeProvider>
}

const GoogleSignInBar = () => {
  const {auth, profile} = useGoogleApisFacade();

  useEffect(() => {
    if (auth.status === 'success') {
      profile.execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status]);

  if (auth.status !== 'success') {
    if (auth.status === 'pending') {
      return <div>Signing in...</div>;
    }

    if (auth.status === 'error') {
      return <div>Sign in failed: {auth.error}</div>;
    }
    return <button onClick={auth.execute}>Sign in via google</button>;
  }

  if (profile.status === 'pending') {
    return <div>Fetching profile...</div>;
  }

  if (profile.status === 'success') {
    return <pre>{JSON.stringify(profile.data, null, 2)}</pre>;
  }
}
