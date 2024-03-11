import { useEffect } from "react";
import { useStore } from "../hooks/useStore/useStore";


export function GoogleSignInBar() {
  const doGoogleAuth = useStore((s) => s.googleSignIn.execute);
  const googleAuthStatus = useStore((s) => s.googleSignIn.status);
  const fetchGoogleProfile = useStore((s) => s.googleProfile.execute);
  const googleProfileStatus = useStore((s) => s.googleProfile.status);

  const googleProfilePicture = useStore((s) => s.googleProfile.data?.picture);
  const googleProfileName = useStore((s) => s.googleProfile.data?.name);
  const googleProfileEmail = useStore((s) => s.googleProfile.data?.email);

  useEffect(() => {
    if (googleAuthStatus === 'success') {
      fetchGoogleProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAuthStatus]);

  if (
    googleAuthStatus !== 'error' &&
    (
      ['idle', 'loading'].includes(googleAuthStatus) || ['idle', 'loading'].includes(googleProfileStatus)
    )
  ) {
    return <progress className="progress" max="100" />;
  }

  if (googleAuthStatus !== 'success') {
    return <button className="button" onClick={() => doGoogleAuth()}>Sign in via google</button>;
  }

  if (googleProfileStatus === 'success') {
    return (
      <div className="media block">
        <div className="media-left">
          <img className="image is-48x48" src={googleProfilePicture} alt="Google profile picture" />
        </div>
        <div className="media-content">
          <b>{googleProfileName}</b>
          <div>{googleProfileEmail}</div>
        </div>
        <div className="media-right">
          <button className="button is-light">Sign out</button>
        </div>
      </div>
    );
  }
}
