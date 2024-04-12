import { monthNames } from "../../../utils/monthNames";
import { statementsToColumns } from "../../../utils/statementsToColumns";
import { StoreCtx } from "../useStore";
import { Statement } from "./monoStatements";

export async function writeMonoStatementsToGoogleSheet(this: StoreCtx) {
  const { sheet, monthIndex, monoAccountIds } = this.getState();

  if (!sheet?.id) {
    throw new Error("sheet.id is not defined");
  }

  if (typeof monthIndex === "undefined") {
    throw new Error("monthIndex is not defined");
  }

  if (!monoAccountIds.length) {
    throw new Error("monoAccountIds is empty");
  }

  this.setState({
    importingProgress: 0,
  })

  const maxOperations = monoAccountIds.length + 1;
  const allStatements: Statement[] = []

  for (let i = 0; i < monoAccountIds.length; i++) {
    if (i !== 0) {
      await waitAMinute();
    }

    await this.getState().monoStatements.executeAsync(monoAccountIds[i])

    allStatements.push(...this.getState().monoStatements.get());

    this.setState({
      importingProgress: (i + 1) / maxOperations,
    });
  }

  await writeStatementsToSheet({
    values: statementsToColumns(allStatements),
    spreadsheetId: sheet.id,
    tabName: monthNames[monthIndex].code,
  });

  this.setState({
    importingProgress: maxOperations,
  });

  this.getState().monoStatements.reset();
}

function waitAMinute() {
  return new Promise((resolve) => setTimeout(resolve, 60_000));
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
