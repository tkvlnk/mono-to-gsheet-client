import { useStore } from "../hooks/useStore/useStore";
import { accountToStrLabel } from "../utils/accountToStrLabel";
import { monthNames } from "../utils/monthNames";
import { GoogleSheetText } from "./GooglePanel/GoogleSheetText";
import cns from 'classnames';

export function Confirmation() {
  const message = useConfirmationMessage();

  const isPending = useStore(s => s.writeMonoStatementsToGoogleSheet.isPending());
  const confirm = useStore(s => s.writeMonoStatementsToGoogleSheet.execute);

  if (!message) {
    return;
  }

  return (
    <div className="panel">
      <div className="panel-block">{message}</div>
      <div className="panel-block">
        <button
          className={cns("is-large", "button", "is-primary" , "is-flex-grow-1", {
            ["is-loading"]: isPending,
          })}
          onClick={confirm}
          disabled={isPending}
        >
          Підтвердити
        </button>
      </div>
    </div>
  );
}

function useConfirmationMessage() {
  const monthIndex = useStore(s => s.monthIndex);
  const year = useStore(s => s.year);
  const account = useStore((s) => s.account);
  const sheet = useStore((s) => s.sheet);
  
  if (typeof monthIndex === "undefined" || !year || !account || !sheet) {
    return null;
  }

  return (
    <div className="columns is-flex-grow-1">
      <div className="column is-two-fifths has-text-centered">
        <div>Імпортувати дані по рахунку</div>
        <div className="has-text-weight-bold">
          <div>{accountToStrLabel(account)}</div>
          <div>
            {monthNames[monthIndex].ua} {year}
          </div>
        </div>
      </div>

      <div className="column has-text-centered">
        <div className="is-size-2 is-hidden-mobile">➡️</div>
        <div className="is-size-2 is-hidden is-inline-block-mobile">⬇️</div>
      </div>

      <div className="column is-two-fifths has-text-centered">
        <div>В таблицю</div>
        <div className="has-text-weight-bold">
          <GoogleSheetText sheet={sheet} />
        </div>
      </div>
    </div>
  );
}
