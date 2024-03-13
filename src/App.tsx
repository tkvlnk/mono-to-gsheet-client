import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/MonoAccountSelector";
import { PeriodPicker } from "./components/PeriodPicker";
import { Confirmation } from "./components/Confirmation";

export default function App() {
  return (
    <div className="section">
      <div className="container is-desktop">
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
