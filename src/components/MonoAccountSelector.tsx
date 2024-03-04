
import { useMonobankApiFacade } from '../hooks/useMonobandApiFacade/useMonobankApiFacade'
import { useStore } from '../hooks/useStore/useStore';
import { currencyNumberToCode } from '../utils/currencyNumberToCode';

export function MonoAccountSelector() {
  const { clientInfo } = useMonobankApiFacade();
  const account = useStore(s => s.account);
  const setAccount = useStore(s => s.setAccount);

  if (clientInfo.status !== 'success') {
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
            <option>Рахунок не обрано</option>
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

