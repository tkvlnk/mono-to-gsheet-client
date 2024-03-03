import { GoogleApisFacadeProvider } from "./hooks/useGoogleApiFacade/useGoogleApisFacade";
import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonobankApiFacadeProvider } from "./hooks/useMonobandApiFacade/useMonobankApiFacade";
import { MonoAccountSelector } from "./components/MonoAccountSelector";
import { PeriodPicker } from "./components/PeriodPicker";
import { ProcessingBar } from "./components/ProcessingBar";

export default function App() {
  return (
    <GoogleApisFacadeProvider>
      <MonobankApiFacadeProvider>
        <div className="section">
          <div className="box">
            <MonoApiKeyInput />
            <MonoAccountSelector />
            <PeriodPicker />
          </div>
          <div className="box">
            <GoogleSignInBar />
            <SheetPicker />
          </div>
          <div className="box">
            <ProcessingBar />
          </div>
        </div>
      </MonobankApiFacadeProvider>
    </GoogleApisFacadeProvider>
  )
}
