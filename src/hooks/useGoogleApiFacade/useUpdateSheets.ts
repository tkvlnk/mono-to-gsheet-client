import { useMutation } from "react-query";

const GOOGLE_UPDATE_SHEETS_QUERY_KEY = "GOOGLE_SHEETS";

export function useUpdateSheets() {
  return useMutation(
    GOOGLE_UPDATE_SHEETS_QUERY_KEY,
    async ({
      range,
      values,
      spreadsheetId,
    }: {
      values: string[][];
      spreadsheetId: string;
      range: string;
    }) => {
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values,
        },
      });
    }
  );
}
