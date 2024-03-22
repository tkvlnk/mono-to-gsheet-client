import { useEffect } from "react";
import { useStore } from "../hooks/useStore/useStore";
import cn from "classnames";

export function GoogleSignInBar() {
  const fetchGoogleProfile = useStore((s) => s.googleProfile.execute);
  const googleAccessToken = useStore((s) => s.googleTokens?.access_token);

  useEffect(() => {
    if (!googleAccessToken) {
      return;
    }

    fetchGoogleProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAccessToken]);

  if (googleAccessToken) {
    return <CurrentGoogleProfile />;
  }

  return <SignInButton />;
}

function CurrentGoogleProfile() {
  const profileError = useStore((s) => s.googleProfile.error?.message);
  const profileStatus = useStore((s) => s.googleProfile.status);

  const picture = useStore((s) => s.googleProfile.data?.picture);
  const name = useStore((s) => s.googleProfile.data?.name);
  const email = useStore((s) => s.googleProfile.data?.email);

  if (profileStatus === "idle") {
    return null;
  }

  if (profileStatus === "pending") {
    return <progress className="progress" max="100" />;
  }

  if (profileStatus === "error") {
    return (
      <div className="notification is-danger">
        Failed to fetch profile: {profileError}
      </div>
    );
  }

  return (
    <div className="media block">
      <div className="media-left">
        <figure className="image is-24x24">
          <img
            className="is-rounded"
            src={picture}
            alt="Google profile picture"
          />
        </figure>
      </div>
      <div className="media-content">
        <b>{name}</b> <span>({email})</span>
      </div>
      <div className="media-right">
        <SignOutButton />
      </div>
    </div>
  );
}

function SignInButton() {
  const googleAuthStatus = useStore((s) => s.googleSignIn.status);
  const handleSignIn = useStore((s) => s.googleSignIn.execute);

  return (
    <button
      className={cn("button", "is-primary", {
        "is-loading": googleAuthStatus === "pending",
      })}
      onClick={() => handleSignIn()}
    >
      Sign in via google
    </button>
  );
}

function SignOutButton() {
  const handleSignOut = useStore((s) => s.googleSignOut.execute);
  const isPending = useStore((s) => s.googleSignOut.isPending());

  return (
    <button
      className={cn("button", {
        "is-loading": isPending,
      })}
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
