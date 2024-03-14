import { useEffect, useState } from "react";
import { useStore } from "../hooks/useStore/useStore";

const LOCAL_STORAGE_ITEM = 'mono-api-key';

export function MonoApiKeyInput() {
  const [inputValue, setInputValue] = useState(() => localStorage.getItem(LOCAL_STORAGE_ITEM) ?? '');
  const isClientInfoLoading = useStore((s) => s.monoClientInfo.isPending());
  const refetchClientInfo = useStore((s) => s.monoClientInfo.execute);
  const updateApiKey = useStore((s) => s.setMonoAuthToken);

  useEffect(() => {
    if (inputValue) {
      localStorage.setItem(LOCAL_STORAGE_ITEM, inputValue);
      updateApiKey(inputValue);
      refetchClientInfo();
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
      <div className={`control  ${isClientInfoLoading ? 'is-loading' : ''}`}>
        <input
          value={inputValue}
          placeholder="Введіть токен доступу до апі монобанка"
          type="text"
          className={`input`} 
          onChange={({ target: {value} }) => setInputValue(value)} 
        />
      </div>
    </div>
  );
}
