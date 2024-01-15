import { GoogleApisFacadeProvider } from "./hooks/useGoogleApiFacade/useGoogleApisFacade";
import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonobankApiFacadeProvider } from "./hooks/useMonobandApiFacade/useMonobankApiFacade";
import { MonoAccountSelector } from "./components/MonoAccountSelector";

export default function App() {
  return (
    <GoogleApisFacadeProvider>
      <MonobankApiFacadeProvider>
        <div className="section">
          <div className="box">
            <MonoApiKeyInput />
            <MonoAccountSelector />
          </div>
          <div className="box">
            <GoogleSignInBar />
            <SheetPicker />
          </div>
        </div>
      </MonobankApiFacadeProvider>
    </GoogleApisFacadeProvider>
  )
}
