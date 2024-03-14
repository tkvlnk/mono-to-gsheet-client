
import { useStore } from '../hooks/useStore/useStore';
import { currencyNumberToCode } from '../utils/currencyNumberToCode';

export function MonoAccountSelector() {
  const clientInfo = useStore(s => s.monoClientInfo)
  const account = useStore(s => s.account);
  const setAccount = useStore(s => s.setAccount);
  const hasMonoAuthToken = useStore(s => !!s.monoAuthToken);

  if (!hasMonoAuthToken || clientInfo.status !== "success") {
    return null;
  }

  return (
    <div className="field">
      <label className="label">
        <span>Оберіть рахунок монобанку</span>
      </label>
      <div className="control">
        <div className="select">
          <select value={account?.id} onChange={(event) => {
            const accountId = event.target.value;
            const selectedAccount = clientInfo.data?.accounts.find(acc => acc.id === accountId);
            if (selectedAccount) {
              setAccount(selectedAccount);
            }
          }}>
            {!account?.id && <option>Рахунок не обрано</option>}
            {clientInfo.data?.accounts
              .filter(acc => acc.maskedPan.length)
              .map(acc => (
                <option
                  key={acc.id}
                  value={acc.id}
                >
                  {`${currencyNumberToCode(acc.currencyCode)} ${acc.type} - ${acc.maskedPan.join(', ')}`}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )
}

