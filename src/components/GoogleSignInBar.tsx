import { useEffect } from "react";
import { useStore } from "../hooks/useStore/useStore";
import cn from "classnames";

export function GoogleSignInBar() {
  useAutofetchProfile();

  return <SignInButton />;
}

function useAutofetchProfile() {
  const shouldFetchProfile = useStore((s) =>
    s.googleTokenClient.isSuccess() && s.googleSignIn.isSuccess()
  );
  const fetchGoogleProfile = useStore((s) => s.googleProfile.execute);

  useEffect(() => {
    if (shouldFetchProfile) {
      fetchGoogleProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchProfile]);
}

function CurrentGoogleProfile() {
  const profileStatus = useStore((s) => s.googleProfile.status);
  const profileError = useStore((s) => s.googleProfile.error?.message);

  const picture = useStore((s) => s.googleProfile.data?.picture);
  const name = useStore((s) => s.googleProfile.data?.name);
  const email = useStore((s) => s.googleProfile.data?.email);

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

  if (profileStatus !== "success") {
    return null;
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

  if (googleAuthStatus === "success") {
    return <CurrentGoogleProfile />;
  }

  return (
    <button
      className={cn("button", "is-primary", {
        "is-loading": googleAuthStatus === 'pending',
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
