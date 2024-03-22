import { useState } from "react";
import { useStore } from "../hooks/useStore/useStore";
import { googleAuthGuard } from "../ hocs/googleAuthGuard";
import { GoogleSheetText } from "./GoogleSheetText";

export const SheetPicker = googleAuthGuard(() => {
  const sheet = useStore(({ sheet }) => sheet);
  const picker = usePicker();

  const pickerBtn = (
    <button
      className={`button ${sheet ? "is-light" : "is-primary"}`}
      onClick={() => picker.setVisible(true)}
    >
      {sheet ? "Змінити" : "Обрати"} таблицю
    </button>
  );

  return (
    <div className="field">
      <label className="label">Гугл таблиця в яку експортувати дані:</label>
      {sheet && (
        <div className="field is-grouped">
          <div className="control block is-flex is-align-items-center">
            <GoogleSheetText sheet={sheet} />
          </div>
          <div className="control">{pickerBtn}</div>
        </div>
      )}
      {!sheet && <div className="control">{pickerBtn}</div>}
    </div>
  );
});

function usePicker() {
  const accessToken = useStore((s) => s.googleTokens?.access_token);
  const onSheetSelected = useStore((state) => state.setSheet);

  const [picker] = useState(() => {
    if (!accessToken) {
      throw new Error("No google access token");
    }

    return new window.google.picker.PickerBuilder()
      .addView(
        new window.google.picker.DocsView(
          window.google.picker.ViewId.SPREADSHEETS
        ).setMode(window.google.picker.DocsViewMode.LIST)
      )
      .setOAuthToken(accessToken)
      .setCallback((data) => {
        if (
          data[window.google.picker.Response.ACTION] ===
          window.google.picker.Action.PICKED
        ) {
          const { id, name } = data.docs[0];
          onSheetSelected({ id, name });
        }
      })
      .build();
  });

  return picker;
}
