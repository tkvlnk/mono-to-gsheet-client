export async function writeStatementsToSheet({
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
