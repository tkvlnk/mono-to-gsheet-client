import { GoogleSignInBar } from "./components/GoogleSignInBar";
import { SheetPicker } from "./components/SheetPicker";
import { MonoApiKeyInput } from "./components/MonoApiKeyInput";
import { MonoAccountSelector } from "./components/MonoAccountSelector";
import { PeriodPicker } from "./components/PeriodPicker";
import { Confirmation } from "./components/Confirmation";
import { QueryClientProvider } from 'react-query/react';
import { QueryClient } from 'react-query';

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
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
        <Confirmation />
      </div>
    </QueryClientProvider>
  )
}
