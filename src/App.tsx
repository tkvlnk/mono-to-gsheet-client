import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/MonoAccountSelector";
import { PeriodPicker } from "./components/PeriodPicker";
import { Confirmation } from "./components/Confirmation";
import { useStore } from "./hooks/useStore/useStore";
import { useEffect } from "react";

export default function App() {
  useInitGoogleTokenClient();

  return (
    <div className="section">
      <div className="container is-max-desktop">
        <div className="box">
          <MonoApiKeyInput />
          <MonoAccountSelector />
          <PeriodPicker />
        </div>
        <div className="box">
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

  useEffect(() => {
    initGoogleTokenClient();
  }, []);
}
