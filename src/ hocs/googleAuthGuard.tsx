import { ComponentType } from "react";
import { useStore } from "../hooks/useStore/useStore";

export function googleAuthGuard<P extends Record<string, unknown>>(Comp: ComponentType<P>): typeof Comp {
  return (props) => {
    const isGoogleAuthSuccess = useStore((s) => s.googleProfile.isSuccess());

    if (!isGoogleAuthSuccess) {
      return null;
    }

    return <Comp {...props} />;
  };
}
