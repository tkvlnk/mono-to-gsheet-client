import { useMemo } from "react";
import { Account } from "../../hooks/useStore/asyncMethods/monoClientInfo";
import { useStore } from "../../hooks/useStore/useStore";
import { accountToStrLabel } from "../../utils/accountToStrLabel";

export function MonoAccountSelector() {
  const clientInfo = useStore((s) => s.monoClientInfo);
  const account = useStore((s) => s.account);
  const setAccount = useStore((s) => s.setAccount);
  const hasMonoAuthToken = useStore((s) => !!s.monoAuthToken);

  if (!hasMonoAuthToken || clientInfo.status !== "success") {
    return null;
  }

  return (
    <div className="field">
      <label className="label">
        <span>Оберіть рахунок монобанку ({clientInfo.data?.name})</span>
      </label>
      <div className="control">
        <div className="select is-link">
          <select
            value={account?.id}
            onChange={(event) => {
              const accountId = event.target.value;
              const selectedAccount = clientInfo.data?.accounts.find(
                (acc) => acc.id === accountId
              );
              if (selectedAccount) {
                setAccount(selectedAccount);
              }
            }}
          >
            {!account?.id && <option>Рахунок не обрано</option>}
            {clientInfo.data?.accounts
              .filter((acc) => acc.maskedPan.length)
              .map((acc) => (
                <AccountOption key={acc.id} account={acc} />
              ))}
          </select>
        </div>
      </div>
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
