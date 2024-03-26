import { useEffect } from "react";
import { useStore } from "../../hooks/useStore/useStore";
import cn from "classnames";

export function MonoApiKeyInput() {
  const apiKey = useStore((s) => s.monoAuthToken);
  const isClientInfoLoading = useStore((s) => s.monoClientInfo.isPending());
  const refetchClientInfo = useStore((s) => s.monoClientInfo.execute);
  const updateApiKey = useStore((s) => s.setMonoAuthToken);
  const clientName = useStore((s) => s.monoClientInfo.data?.name);
  const resetClientInfo = useStore((s) => s.monoClientInfo.reset);


  useEffect(() => {
    if (apiKey) {
      refetchClientInfo();
    } else {
      resetClientInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  return (
    <div className="field is-flex-grow-1">
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
      <div className="field-body">
        <div className="field has-addons">
          <div
            className={cn("control", "is-expanded", {
              ["is-loading"]: isClientInfoLoading,
            })}
          >
            <input
              value={apiKey}
              placeholder="Введіть токен доступу до апі монобанка"
              type="text"
              className={`input`}
              onChange={({ target: { value } }) => updateApiKey(value)}
            />
          </div>
          {clientName && (
            <div className="control">
              <button className="button is-static">{clientName}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
