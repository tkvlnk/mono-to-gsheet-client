import { useMemo } from "react";
import { Account } from "../../hooks/useStore/asyncMethods/monoClientInfo";
import { useStore } from "../../hooks/useStore/useStore";
import { accountToStrLabel } from "../../utils/accountToStrLabel";

export function MonoAccountSelector() {
  const clientInfo = useStore((s) => s.monoClientInfo);
  const hasMonoAuthToken = useStore((s) => !!s.monoAuthToken);

  if (!hasMonoAuthToken || clientInfo.status !== "success") {
    return null;
  }

  return (
    <div className="panel-block">
      <div className="field">
        <label className="label">
          <span>Оберіть рахунок монобанку:</span>
        </label>
        <div className="control">
          <AccountSelect />
        </div>
      </div>
    </div>
  );
}

function AccountSelect() {
  const clientInfo = useStore((s) => s.monoClientInfo);
  const monoAccountId = useStore((s) => s.monoAccountId);
  const setAccount = useStore((s) => s.setAccountMonoAccountId);

  return (
    <div className="select is-link">
      <select
        value={monoAccountId}
        onChange={(event) => {
          const accountId = event.target.value;

          setAccount(accountId);
        }}
      >
        {!monoAccountId && <option>Рахунок не обрано</option>}
        {clientInfo.data?.accounts
          .filter((acc) => acc.maskedPan.length)
          .map((acc) => (
            <AccountOption key={acc.id} account={acc} />
          ))}
      </select>
    </div>
  );
}

function AccountOption({ account }: { account: Account }) {
  return (
    <option value={account.id}>
      {useMemo(() => accountToStrLabel(account), [account])}
    </option>
  );
}
