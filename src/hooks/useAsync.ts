import { useEffect, useState } from "react";

export function useAsync<T extends (...args: never[]) => Promise<unknown>>(asyncFn: T, {
  auto = false,
} = {}) {
  const [state, setState] = useState({
    state: "idle" as  "idle" | "pending" | "success" | "error",
    data: null as null | Awaited<ReturnType<T>>,
    error: null as null | string,
  });

  const execute = () => {
    setState({ state: "pending", data: null, error: null });
    asyncFn()
      .then(data => setState(prev => ({ ...prev, state: "success", data: data as Awaited<ReturnType<T>>, error: null })))
      .catch(error => setState(prev => ({ ...prev, state: "error", data: null, error })));
  };

  useEffect(() => {
    if (auto) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFn]);

  return {
    ...state,
    execute,
  }
}
