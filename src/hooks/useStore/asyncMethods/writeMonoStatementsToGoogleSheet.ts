import { monthNames } from "../../../utils/monthNames";
import { statementsToColumns } from "../../../utils/statementsToColumns";
import { StoreCtx } from "../useStore";

export async function writeMonoStatementsToGoogleSheet(this: StoreCtx) {
  const { sheet, monthIndex } = this.getState();

  if (!sheet?.id) {
    throw new Error("sheet.id is not defined");
  }

  if (typeof monthIndex === "undefined") {
    throw new Error("monthIndex is not defined");
  }

  return writeStatementsToSheet({
    values: statementsToColumns(this.getState().monoStatements.get()),
    spreadsheetId: sheet.id,
    tabName: monthNames[monthIndex].code,
  });
}

async function writeStatementsToSheet({
  tabName,
  values,
  spreadsheetId,
}: {
  values: string[][];
  spreadsheetId: string;
  tabName: string;
}) {
  try {
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          },
        ],
      },
    });
  } catch {
    /* empty */
  }

  await window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!A1`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values,
    },
  });
}
