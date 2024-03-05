import { useGoogleApisFacade } from "../hooks/useGoogleApiFacade/useGoogleApisFacade";
import { useMonobankApiFacade } from "../hooks/useMonobandApiFacade/useMonobankApiFacade";
import { useStore } from "../hooks/useStore/useStore";
import { monthNames } from "../utils/monthNames";

export function Confirmation() {
  const message = useConfirmationMessage();
  
  const { getStatements } = useMonobankApiFacade();
  const { updateSheets } = useGoogleApisFacade();

  const loadFromMonoToSheet = useLoadFromMonoAndPutToGoogleSheet()

  if (message) {
    return;
  }

  if (getStatements.status === 'loading' || updateSheets.status === 'loading') {
    return <progress className="progress" max="100" />;
  }

  return (
    <div>
      <div className="block">{message}</div>
      <button className='block button is-primary' onClick={loadFromMonoToSheet}>Підтвердити</button>
    </div>
  );
}

function useConfirmationMessage() {
  const monthIndex = useStore(s => s.monthIndex);
  const year = useStore(s => s.year);
  const accountType = useStore(s => s.account?.type);
  const sheetName = useStore(s => s.sheet?.name);
  const sheetId = useStore(s => s.sheet?.id);

  if (typeof monthIndex === 'undefined' || !year || !accountType || !sheetName || !sheetId) {
    return;
  }

  return `Імпортувати дані по рахунку ${accountType} за ${monthNames[monthIndex].ua} ${year} в таблицю ${sheetName} (id: ${sheetId})`
}

function useLoadFromMonoAndPutToGoogleSheet() {
  const { getStatements } = useMonobankApiFacade();
  const { updateSheets } = useGoogleApisFacade();

  return async () => {
    updateSheets.mutate({
      statements: await getStatements.mutateAsync()
    });
  }
}

