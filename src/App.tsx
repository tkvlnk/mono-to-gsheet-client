import { GoogleApisFacadeProvider } from "./hooks/useGoogleApiFacade/useGoogleApisFacade";
import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";

export default function App() {
  return <GoogleApisFacadeProvider>
    <GoogleSignInBar />
    <SheetPicker />
  </GoogleApisFacadeProvider>
}
