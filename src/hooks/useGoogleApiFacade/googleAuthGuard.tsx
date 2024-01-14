import { ComponentType } from "react";
import { useGoogleApisFacade } from "./useGoogleApisFacade";

export function googleAuthGuard<P extends Record<string, unknown>>(Comp: ComponentType<P>): typeof Comp {
  return (props) => {
    const { auth } = useGoogleApisFacade();

    if (auth.status !== 'success') {
      return null;
    }

    return <Comp {...props} />;
  };
}
