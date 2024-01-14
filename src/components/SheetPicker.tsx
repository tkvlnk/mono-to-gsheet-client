import { useState } from "react";
import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";
import { googleAuthGuard } from "../hooks/useGoogleApiFacade/googleAuthGuard";

export const SheetPicker = googleAuthGuard(() => {
  const [sheet, onSheetSelected] = useState(null as null | { id: string; name: string });
  const { getAccessToken } = useGoogleApisFacade();

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

  const pickerBtn = (
    <button
      className={`button ${sheet ? 'is-light' : 'is-primary'}`}
      onClick={() => picker.setVisible(true)}
    >
      {sheet ? "Змінити" : "Обрати"} таблицю
    </button>
  )

  return (
    <div className="field">
      <label className="label">Гугл таблиця в які експортувати дані:</label>
      {sheet && (
        <div className="field is-grouped">
          <div className="control block is-flex is-align-items-center">
            {sheet.name} (id: {sheet.id})
          </div>
          <div className="control">
            {pickerBtn}
          </div>
        </div>
      )}
      {!sheet && <div className="control">
        {pickerBtn}
      </div>}
    </div>
  );
})
