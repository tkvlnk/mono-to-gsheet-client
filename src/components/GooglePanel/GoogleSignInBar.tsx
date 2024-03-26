import { useEffect } from "react";
import { useStore } from "../../hooks/useStore/useStore";
import cn from "classnames";

export function GoogleSignInBar() {
  const fetchGoogleProfile = useStore((s) => s.googleProfile.execute);
  const googleAccessToken = useStore((s) => s.googleTokens?.access_token);

  useEffect(() => {
    if (
      !googleAccessToken ||
      useStore.getState().googleProfile.status === "pending"
    ) {
      return;
    }

    fetchGoogleProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAccessToken]);

  return (
    <div className="panel-block">
      {googleAccessToken ? <CurrentGoogleProfile /> : <SignInButton />}
    </div>
  );
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
    <div className="level is-mobile is-flex-grow-1">
      <div className="level-left">
        <div className="level-item is-gap-2">
          <figure className="image is-24x24">
            <img
              className="is-rounded"
              src={picture}
              alt="Google profile picture"
            />
          </figure>
          <div className="is-hidden-mobile is-flex is-gap-1">
            <div className="has-text-weight-bold">{name}</div>
            <span className="control">({email})</span>
          </div>

          <div className="is-hidden is-flex-mobile ">{email}</div>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

function SignInButton() {
  const googleAuthStatus = useStore((s) => s.googleSignIn.status);
  const handleSignIn = useStore((s) => s.googleSignIn.execute);

  return (
    <button
      className={cn("button", "is-link", {
        "is-loading": googleAuthStatus === "pending",
      })}
      onClick={() => handleSignIn()}
    >
      Увійти через Google
    </button>
  );
}

function SignOutButton() {
  const handleSignOut = useStore((s) => () => {
    s.setSheet(undefined);
    s.googleSignOut.execute()
  });
  const isPending = useStore((s) => s.googleSignOut.isPending());

  return (
    <button
      className={cn("button", "is-small", {
        "is-loading": isPending,
      })}
      onClick={handleSignOut}
    >
      Вийти
    </button>
  );
}
