import { useMonobankApiFacade } from '../hooks/useMonobandApiFacade/useMonobankApiFacade'
import { currencyNumberToCode } from '../utils/currencyNumberToCode';

export function MonoAccountSelector() {
  const { clientInfo } = useMonobankApiFacade();

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
          <select>
            <option>Рахунок не обрано</option>
            {clientInfo.data?.accounts
              .filter(account => account.maskedPan.length)
              .map(account => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {`${currencyNumberToCode(account.currencyCode)} ${account.type} - ${account.maskedPan.join(', ')}`}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )
}

