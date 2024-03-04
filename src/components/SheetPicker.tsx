import { useState } from "react";
import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";
import { googleAuthGuard } from "../hooks/useGoogleApiFacade/googleAuthGuard";
import { useStore } from "../hooks/useStore/useStore";

export const SheetPicker = googleAuthGuard(() => {
  const sheet = {
    id: useStore(({ sheet }) => sheet?.id),
    name: useStore(({ sheet }) => sheet?.name),
  };
  const onSheetSelected = useStore((state) => state.setSheet);

  const { getAccessToken } = useGoogleApisFacade();

  const [picker] = useState(() =>
    new window.google.picker.PickerBuilder()
      .addView(new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS).setMode(window.google.picker.DocsViewMode.LIST))
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
      {sheet.id ? "Змінити" : "Обрати"} таблицю
    </button>
  )

  return (
    <div className="field">
      <label className="label">Гугл таблиця в яку експортувати дані:</label>
      {sheet.id && (
        <div className="field is-grouped">
          <div className="control block is-flex is-align-items-center">
            {sheet.name} (id: {sheet.id})
          </div>
          <div className="control">
            {pickerBtn}
          </div>
        </div>
      )}
      {!sheet.id && <div className="control">
        {pickerBtn}
      </div>}
    </div>
  );
})
