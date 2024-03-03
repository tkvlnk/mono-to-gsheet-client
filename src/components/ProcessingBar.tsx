import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";
import { useMonobankApiFacade } from "../hooks/useMonobandApiFacade/useMonobankApiFacade";
import { useStore } from "../hooks/useStore";
import { monthNames } from "../utils/monthNames";
import { statementsToColumns } from "../utils/statementsToColumns";

export function ProcessingBar() {
  const monthIndex = useStore(s => s.monthIndex);
  const year = useStore(s => s.year);
  const accountType = useStore(s => s.account?.type);
  const sheetName = useStore(s => s.sheet?.name);
  const sheetId = useStore(s => s.sheet?.id);
  
  const { getStatements } = useMonobankApiFacade();
  const { updateSheets } = useGoogleApisFacade();

  const loadFromMonoToSheet = useLoadFromMonoAndPutToGoogleSheet()

  if (typeof monthIndex === 'undefined' || !year || !accountType || !sheetName || !sheetId) {
    return;
  }

  if (getStatements.status === 'pending' || updateSheets.status === 'pending') {
    return <progress className="progress" max="100" />;
  }

  return (
    <div>
      <div className="block">Імпортувати дані по рахунку {accountType} за {monthNames[monthIndex].ua} {year} в таблицю {sheetName} (id: {sheetId})</div>
      <button className='block button is-primary' onClick={loadFromMonoToSheet}>Підтвердити</button>
    </div>
  );
}

function useLoadFromMonoAndPutToGoogleSheet() {
  const monthIndex = useStore(s => s.monthIndex);
  const year = useStore(s => s.year);
  const account = useStore(s => s.account?.id);
  const spreadsheetId = useStore(s => s.sheet?.id);

  const { getStatements } = useMonobankApiFacade();
  const { updateSheets } = useGoogleApisFacade();

  return async () => {
    if (!account) {
      throw new Error('Account is not selected');
    }

    if (typeof monthIndex === 'undefined') {
      throw new Error('Month is not selected');
    }

    if (!year) {
      throw new Error('Year is not selected');
    }

    if (!spreadsheetId) {
      throw new Error('Spreadsheet Id is not selected');
    }

    const statements = statementsToColumns(await getStatements.executeStrict({
      account,
      from: toSeconds(new Date(year, monthIndex, 1)),
      to: toSeconds(new Date(year, monthIndex + 1, 0, 23, 59, -1))
    }));

    await updateSheets.executeStrict({
      spreadsheetId,
      range: 'TEST!A1',
      values: statements
    });
  }

  function toSeconds(date: Date) {
    return Math.round(date.getTime() / 1000);
  }
}

