import { useState } from "react";
import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";

export function SheetPicker() {
  const { auth } = useGoogleApisFacade();

  if (auth.status !== 'success') {
    return null;
  }

  return <WhenAuthorized />;
}

function WhenAuthorized(){
  const [sheet, onSheetSelected] = useState(null as null | { id: string; name: string });
  const { auth } = useGoogleApisFacade();

  const getAccessToken = () => {
    if (!auth.data?.access_token) {
      throw new Error('Need authorize first');
    }

    return auth.data.access_token
  };

  const [picker] = useState(() =>
    new window.google.picker.PickerBuilder()
      .addView(new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS))
      .setOAuthToken(getAccessToken())
      .setCallback((data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const { id, name } = data.docs[0];
          console.log(data);
          onSheetSelected({ id, name });
        }
      })
      .build()
  );

  return (
    <div>
      <button onClick={() => picker.setVisible(true)}>Open sheet picker</button>
      {sheet && <div>Selected sheet id: {sheet.name} ({sheet.id})</div>}
    </div>
  );
}
