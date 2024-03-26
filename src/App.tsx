import { GoogleSignInBar } from "./components/GooglePanel/GoogleSignInBar";
import { SheetPicker } from "./components/GooglePanel/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoPanel/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/MonoPanel/MonoAccountSelector";
import { PeriodPicker } from "./components/MonoPanel/PeriodPicker";
import { Confirmation } from "./components/Confirmation";
import { useStore } from "./hooks/useStore/useStore";
import { useEffect, useRef } from "react";
import { Disclaimer } from "./components/Disclaimer";
import { Footer } from "./components/Footer";

export default function App() {
  useInitGoogleTokenClient();

  return (
    <>
      <div className="section">
        <div className="container is-max-desktop">
          <h1 className="title is-1">Monobank 👉 Google Sheets</h1>
          <h2 className="subtitle is-4">
            Імпортуйте дані з монобанка в гугл-таблицю
          </h2>

          <Disclaimer />

          <div className="panel">
            <div className="panel-block">
              <h3 className="title is-3">Monobank</h3>
            </div>
            <MonoApiKeyInput />
            <MonoAccountSelector />
            <PeriodPicker />
          </div>
          <div className="panel">
            <div className="panel-block">
              <h3 className="title is-3">Google</h3>
            </div>
            <GoogleSignInBar />
            <SheetPicker />
          </div>
          <Confirmation />
        </div>
      </div>
      <Footer />
    </>
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
