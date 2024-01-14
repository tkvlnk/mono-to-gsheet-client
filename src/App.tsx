import { GoogleApisFacadeProvider } from "./hooks/useGoogleApiFacade/useGoogleApisFacade";
import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";

export default function App() {
  return <GoogleApisFacadeProvider>
    <div className="section">
      <div className="box"></div>
      <div className="box">
        <GoogleSignInBar />
        <SheetPicker />
      </div>
    </div>
  </GoogleApisFacadeProvider>
}
