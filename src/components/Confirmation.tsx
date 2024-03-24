import { useStore } from "../hooks/useStore/useStore";
import { accountToStrLabel } from "../utils/accountToStrLabel";
import { monthNames } from "../utils/monthNames";
import { GoogleSheetText } from "./MonobankPanel/GoogleSheetText";

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
  const account = useStore((s) => s.account);
  const sheet = useStore((s) => s.sheet);
  
  if (typeof monthIndex === "undefined" || !year || !account || !sheet) {
    return;
  }

  return (
    <div>
      Імпортувати дані по рахунку <b>{accountToStrLabel(account)}</b> за{" "}
      <b>
        {monthNames[monthIndex].ua} {year}
      </b>{" "}
      в таблицю <GoogleSheetText sheet={sheet} />
    </div>
  );
}
