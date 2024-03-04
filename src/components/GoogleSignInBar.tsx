import { useEffect } from "react";
import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";

export function GoogleSignInBar() {
  const { auth, profile } = useGoogleApisFacade();

  useEffect(() => {
    if (auth.status === 'success') {
      profile.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status]);

  if (['idle', 'loading'].includes(auth.status) || ['idle', 'loading'].includes(profile.status)) {
    return <progress className="progress" max="100" />;
  }

  if (auth.status !== 'success') {
    return <button className="button" onClick={() => auth.refetch()}>Sign in via google</button>;
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
