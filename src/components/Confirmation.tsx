import { useStore } from "../hooks/useStore/useStore";
import { monthNames } from "../utils/monthNames";

export function Confirmation() {
  const message = useConfirmationMessage();

  const isPending = useStore(s => s.writeMonoStatementsToGoogleSheet.isPending());
  const confirm = useStore(s => s.writeMonoStatementsToGoogleSheet.execute);

  if (!message) {
    return;
  }

  if (isPending) {
    return (
      <div className="box">
        <progress className="progress" max="100" />
      </div>
    );
  }

  return (
    <div className="box">
      <div className="block">{message}</div>
      <button className='block button is-primary' onClick={confirm}>Підтвердити</button>
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
