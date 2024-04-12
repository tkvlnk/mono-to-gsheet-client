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
        <div>
          <AccountCheckboxes />
        </div>
      </div>
    </div>
  );
}

function AccountCheckboxes() {
  const clientInfo = useStore((s) => s.monoClientInfo);
  const monoAccountIds = useStore((s) => s.monoAccountIds);
  const addId = useStore((s) => s.addMonoAccountId);
  const removeId = useStore((s) => s.removeMonoAccountId);

  return (
    <div>
      {clientInfo.data?.accounts
        .filter((acc) => acc.maskedPan.length)
        .map((acc) => (
          <div key={acc.id} className="block">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={monoAccountIds.includes(acc.id)}
                onChange={({ target: { checked } }) => {
                  if (checked) {
                    addId(acc.id);
                  } else {
                    removeId(acc.id);
                  }
                }}
              />
              <AccountOption account={acc} />
            </label>
          </div>
        ))}
    </div>
  );
}

function AccountOption({ account }: { account: Account }) {
  return (
    <span>
      {useMemo(() => accountToStrLabel(account), [account])}
    </span>
  );
}
