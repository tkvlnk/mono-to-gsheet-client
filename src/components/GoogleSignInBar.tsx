import { useEffect } from "react";
import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";

export function GoogleSignInBar() {
  const { auth, profile } = useGoogleApisFacade();

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

    return <button className="button" onClick={() => auth.execute()}>Sign in via google</button>;
  }

  if (profile.status === 'pending') {
    return <div>Fetching profile...</div>;
  }

  if (profile.status === 'success') {
    return (
      <div className="media block">
        <div className="media-left">
          <img className="image is-48x48" src={profile.data?.picture} alt="Google profile picture" />
        </div>
        <div className="media-content">
          <b>{profile.data?.name}</b>
          <div>{profile.data?.email}</div>
        </div>
        <div className="media-right">
          <button className="button is-light">Sign out</button>
        </div>
      </div>
    );
  }
}
