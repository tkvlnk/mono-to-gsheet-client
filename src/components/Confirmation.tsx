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

  return (
    <div className="card">
      <div className="card-content">{message}</div>
      <footer className="card-footer">
        <button
          className={`card-footer-item is-big button is-primary ${
            isPending ? "is-loading" : ""
          }`}
          onClick={confirm}
        >
          Підтвердити
        </button>
      </footer>
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

  // return (
  //   <div className="columns">
  //     <div className="column is-two-fifths">
  //       <div>Імпортувати дані по рахунку</div>
  //       <div className="title">{accountToStrLabel(account)}</div>
  //       <div className="title">
  //         {monthNames[monthIndex].ua} {year}
  //       </div>
  //     </div>
  //     <div className="column"></div>
  //     <div className="column is-two-fifths">
  //       <div>В таблицю</div>
  //       <div className="title">
  //         <GoogleSheetText sheet={sheet} />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="level">
      <div className="level-item has-text-centered">
        <div>
          <div>Імпортувати дані по рахунку</div>
          <div className="has-text-weight-bold">
            <div>{accountToStrLabel(account)}</div>
            <div>
              {monthNames[monthIndex].ua} {year}
            </div>
          </div>
        </div>
      </div>

      <div className="level-item">
        <div className="is-size-2">➡️</div>
      </div>

      <div className="level-item has-text-centered">
        <div>
          <div>В таблицю</div>
          <div  className="has-text-weight-bold">
            <GoogleSheetText sheet={sheet} />
          </div>
        </div>
      </div>
    </div>
  );
}
