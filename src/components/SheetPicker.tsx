import { useState } from "react";
import { useStore } from "../hooks/useStore/useStore";
import { googleAuthGuard } from "../hooks/useGoogleApiFacade/googleAuthGuard";

export const SheetPicker = googleAuthGuard(() => {
  const sheetId = useStore(({ sheet }) => sheet?.id);
  const sheetName = useStore(({ sheet }) => sheet?.name);
  
  const onSheetSelected = useStore((state) => state.setSheet);

  const accessToken = useStore((s) => s.googleSignIn.get().access_token);

  const [picker] = useState(() =>
    new window.google.picker.PickerBuilder()
      .addView(new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS).setMode(window.google.picker.DocsViewMode.LIST))
      .setOAuthToken(accessToken)
      .setCallback((data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const { id, name } = data.docs[0];
          console.log(data);
          onSheetSelected({ id, name });
        }
      })
      .build()
  );

  const pickerBtn = (
    <button
      className={`button ${sheetId ? 'is-light' : 'is-primary'}`}
      onClick={() => picker.setVisible(true)}
    >
      {sheetId ? "Змінити" : "Обрати"} таблицю
    </button>
  )

  return (
    <div className="field">
      <label className="label">Гугл таблиця в яку експортувати дані:</label>
      {sheetId && (
        <div className="field is-grouped">
          <div className="control block is-flex is-align-items-center">
            {sheetName} (id: {sheetId})
          </div>
          <div className="control">
            {pickerBtn}
          </div>
        </div>
      )}
      {!sheetId && <div className="control">
        {pickerBtn}
      </div>}
    </div>
  );
})
