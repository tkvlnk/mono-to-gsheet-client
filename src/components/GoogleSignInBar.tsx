import { useEffect } from "react";
import { useStore } from "../hooks/useStore/useStore";

export function GoogleSignInBar() {
  const doGoogleAuth = useStore((s) => s.googleSignIn.execute);
  const googleAuthStatus = useStore((s) => s.googleSignIn.status);
  const isGoogleTokenClientSuccess = useStore((s) => s.googleTokenClient.isSuccess());
  const fetchGoogleProfile = useStore((s) => s.googleProfile.execute);
  const googleProfileStatus = useStore((s) => s.googleProfile.status);

  const googleProfilePicture = useStore((s) => s.googleProfile.data?.picture);
  const googleProfileName = useStore((s) => s.googleProfile.data?.name);
  const googleProfileEmail = useStore((s) => s.googleProfile.data?.email);

  const googleSignOut = useStore((s) => s.googleSignOut.execute);

  useEffect(() => {
    if (googleAuthStatus === "success" && isGoogleTokenClientSuccess) {
      fetchGoogleProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAuthStatus, isGoogleTokenClientSuccess]);

  if (
    googleAuthStatus !== "error" &&
    (["idle", "loading"].includes(googleAuthStatus) ||
      ["idle", "loading"].includes(googleProfileStatus))
  ) {
    return <progress className="progress" max="100" />;
  }

  if (googleAuthStatus !== "success") {
    return (
      <button
        className={`button ${
          googleAuthStatus === "pending" ? "is-loading" : ""
        }`}
        onClick={() => doGoogleAuth()}
      >
        Sign in via google
      </button>
    );
  }

  if (googleProfileStatus !== "success") {
    return null;
  }

  return (
    <div className="media block">
      <div className="media-left">
        <figure className="image is-24x24">
          <img
            className="is-rounded"
            src={googleProfilePicture}
            alt="Google profile picture"
          />
        </figure>
      </div>
      <div className="media-content">
        <b>{googleProfileName}</b> <span>({googleProfileEmail})</span>
      </div>
      <div className="media-right">
        <button className="button is-light is-small" onClick={googleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="is-flex is-align-content-center">


      <b>{googleProfileName}</b>
      <div>({googleProfileEmail})</div>
    </div>
  );

  if (googleProfileStatus === "success") {
    return (
      <div className="media block">
        <div className="media-left">
          <img
            className="image is-48x48"
            src={googleProfilePicture}
            alt="Google profile picture"
          />
        </div>
        <div className="media-content">
          <b>{googleProfileName}</b>
          <div>{googleProfileEmail}</div>
        </div>
        <div className="media-right">
          <button className={`button is-light`} onClick={googleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }
}
