import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/MonoAccountSelector";
import { PeriodPicker } from "./components/PeriodPicker";
import { Confirmation } from "./components/Confirmation";
import { useStore } from "./hooks/useStore/useStore";
import { useEffect, useRef } from "react";

export default function App() {
  useInitGoogleTokenClient();

  return (
    <div className="section">
      <div className="container is-max-desktop">
        <div className="panel is-link">
          <div className="panel-heading">Monobank</div>
          <div className="panel-block">
            <MonoApiKeyInput />
          </div>
          <div className="panel-block">
            <MonoAccountSelector />
          </div>
          <div className="panel-block">
            <PeriodPicker />
          </div>
        </div>
        <div className="panel is-link">
          <div className="panel-heading">
            <div className="is-flex is-justify-content-space-between">
              <div>Google</div>
              <GoogleSignInBar />
            </div>
          </div>
          <div className="panel-block">
            <SheetPicker />
          </div>
        </div>
        <Confirmation />
      </div>
    </div>
  );
}

function useInitGoogleTokenClient() {
  const initGoogleTokenClient = useStore((s) => s.googleTokenClient.execute);

  const isStarted = useRef(false);

  useEffect(() => {
    if (isStarted.current) {
      return;
    }

    isStarted.current = true;
    initGoogleTokenClient();
  }, []);
}
