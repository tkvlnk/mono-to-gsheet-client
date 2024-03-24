import { useEffect } from "react";
import { useStore } from "../../hooks/useStore/useStore";

export function MonoApiKeyInput() {
  const apiKey = useStore((s) => s.monoAuthToken);
  const isClientInfoLoading = useStore((s) => s.monoClientInfo.isPending());
  const refetchClientInfo = useStore((s) => s.monoClientInfo.execute);
  const updateApiKey = useStore((s) => s.setMonoAuthToken);

  useEffect(() => {
    if (apiKey) {
      refetchClientInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  return (
    <div className="field">
      <label className="label">
        <span>
          Токен доступу до апі монобанка (його можна отримати{" "}
          <a
            target="_blank"
            className="is-underlined"
            href="https://api.monobank.ua/"
          >
            тут
          </a>
          )
        </span>
      </label>
      <div className={`control${isClientInfoLoading ? "is-loading" : ""}`}>
        <input
          value={apiKey}
          placeholder="Введіть токен доступу до апі монобанка"
          type="text"
          className={`input`}
          onChange={({ target: { value } }) => updateApiKey(value)}
        />
      </div>
    </div>
  );
}
