import { ComponentType, useEffect } from "react";
import { useStore } from "../hooks/useStore/useStore";

export function googleAuthGuard<P extends Record<string, unknown>>(Comp: ComponentType<P>): typeof Comp {
  return (props) => {
    const initGoogleAuth = useStore((s) => () => {
      if (!s.googleSignIn.isIdle()) {
        return;
      }

      s.googleSignIn.execute({ cacheOnly: true })
    });

    useEffect(() => {
      initGoogleAuth();
    }, [])

    const isGoogleAuthSuccess = useStore((s) => s.googleSignIn.isSuccess());

    if (!isGoogleAuthSuccess) {
      return null;
    }

    return <Comp {...props} />;
  };
}
