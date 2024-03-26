import { useState } from "react";
import { useStore } from "../../hooks/useStore/useStore";
import { googleAuthGuard } from "../../ hocs/googleAuthGuard";
import { GoogleSheetText } from "./GoogleSheetText";

export const SheetPicker = googleAuthGuard(() => {
  const sheet = useStore(({ sheet }) => sheet);
  const picker = usePicker();

  const pickerBtn = (
    <button
      className={`button ${sheet ? "is-small" : "is-link"}`}
      onClick={() => picker.setVisible(true)}
    >
      {sheet ? "Змінити" : "Обрати"} таблицю
    </button>
  );

  return (
    <div className="panel-block">
      <div className="field is-flex-grow-1">
        <label className="label">Гугл таблиця в яку експортувати дані:</label>
        {sheet && (
          <div className="level is-mobile is-flex-grow-1">
            <div className="level-left">
              <div className="level-item">
                <GoogleSheetText sheet={sheet} />
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">{pickerBtn}</div>
            </div>
          </div>
        )}
        {!sheet && <div className="control">{pickerBtn}</div>}
      </div>
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
