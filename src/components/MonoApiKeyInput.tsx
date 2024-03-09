import { useEffect, useState } from "react";
import { useMonobankApiFacade } from "../hooks/useMonobandApiFacade/useMonobankApiFacade";

const LOCAL_STORAGE_ITEM = 'mono-api-key';

export function MonoApiKeyInput() {
  const [inputValue, setInputValue] = useState(() => localStorage.getItem(LOCAL_STORAGE_ITEM) ?? '');
  const { updateApiKey, clientInfo } = useMonobankApiFacade();

  useEffect(() => {
    if (inputValue) {
      localStorage.setItem(LOCAL_STORAGE_ITEM, inputValue);
      updateApiKey(inputValue);
      clientInfo.refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="field">
      <label className="label">
        <span>
          Токен доступу до апі монобанка
          (його можна отримати <a target="_blank" className="is-underlined" href="https://api.monobank.ua/">тут</a>)
        </span>
      </label>
      <div className="control">
        <input
          value={inputValue}
          placeholder="Введіть токен доступу до апі монобанка"
          type="text"
          className={`input ${clientInfo.status === 'loading' ? 'is-loading' : ''}`} 
          onChange={({ target: {value} }) => setInputValue(value)} 
        />
      </div>
    </div>
  );
}
