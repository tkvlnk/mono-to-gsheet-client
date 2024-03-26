import { GoogleSignInBar } from "./components/MonobankPanel/GoogleSignInBar";
import { SheetPicker } from "./components/MonobankPanel/SheetPicker";
import { MonoApiKeyInput } from "./components/GooglePanel/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/GooglePanel/MonoAccountSelector";
import { PeriodPicker } from "./components/GooglePanel/PeriodPicker";
import { Confirmation } from "./components/Confirmation";
import { useStore } from "./hooks/useStore/useStore";
import { useEffect, useRef } from "react";

export default function App() {
  useInitGoogleTokenClient();

  return (
    <div className="section">
      <div className="container is-max-desktop">
        <div className="panel">
          <div className="panel-block">
            <h2 className="title">Monobank</h2>
          </div>
          <div className="panel-block">
            <MonoApiKeyInput />
          </div>
          <MonoAccountSelector />
          <PeriodPicker />
        </div>
        <div className="panel">
          <div className="panel-block">
            <h2 className="title">Google</h2>
          </div>
          <GoogleSignInBar />
          <SheetPicker />
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
