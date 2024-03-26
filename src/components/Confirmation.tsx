import { useStore } from "../hooks/useStore/useStore";
import { accountToStrLabel } from "../utils/accountToStrLabel";
import { monthNames } from "../utils/monthNames";
import { GoogleSheetText } from "./GooglePanel/GoogleSheetText";
import cns from "classnames";

export function Confirmation() {
  const message = useConfirmationMessage();

  if (!message) {
    return;
  }

  return (
    <div className="panel">
      <div className="panel-block">{message}</div>
      <div className="panel-block">
        <ConfirmBtn />
      </div>
    </div>
  );
}

function useConfirmationMessage() {
  const monthIndex = useStore((s) => s.monthIndex);
  const year = useStore((s) => s.year);
  const monoAccountId = useStore((s) => s.monoAccountId);
  const sheet = useStore((s) => s.sheet);

  if (typeof monthIndex === "undefined" || !year || !monoAccountId || !sheet) {
    return null;
  }

  return (
    <div className="columns is-flex-grow-1">
      <div className="column is-two-fifths has-text-centered">
        <div>Імпортувати дані по рахунку</div>
        <div className="has-text-weight-bold">
          <AccountLabel />
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

function AccountLabel() {
  const account = useStore((s) => s.getMonoAccount());

  return <div>{accountToStrLabel(account)}</div>;
}

function ConfirmBtn() {
  const confirm = useStore(
    (s) => s.writeMonoStatementsToGoogleSheet.executeAsync
  );
  const confirmationStatus = useStore(
    (s) => s.writeMonoStatementsToGoogleSheet.status
  );
  const resetConfirmation = useStore(
    (s) => s.writeMonoStatementsToGoogleSheet.reset
  );

  const isPending = confirmationStatus === "pending";

  const handleClick = async () => {
    try {
      await confirm();
    } finally {
      setTimeout(resetConfirmation, 3000);
    }
  };

  return (
    <button
      className={cns("is-large", "button", "is-primary", "is-flex-grow-1", {
        ["is-loading"]: isPending,
        ["is-success"]: confirmationStatus === "success",
        ["is-danger"]: confirmationStatus === "error",
      })}
      onClick={handleClick}
      disabled={isPending}
    >
      {
        {
          idle: "Підтвердити",
          pending: "Підтвердження...",
          success: "Успішно",
          error: "Помилка",
        }[confirmationStatus]
      }
    </button>
  );
}
