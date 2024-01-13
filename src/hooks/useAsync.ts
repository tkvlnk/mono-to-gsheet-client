import { useEffect, useState } from "react";

export type AsyncState<T extends (...args: never[]) => Promise<unknown>> = {
  status: "idle"
  data: null;
  error: null;
  params: null;
} | {
  status: "pending";
  data: null;
  error: null;
  params: Parameters<T>;
} | {
  status: "success";
  data: Awaited<ReturnType<T>>;
  error: null;
  params: Parameters<T>;
} | {
  status: "error";
  data: null;
  error: string;
  params: Parameters<T>;
}

export type AsyncStateInSuccess<S extends AsyncState<(...args: never[]) => Promise<unknown>>> = {
  status: "success";
  data: NonNullable<S['data']>;
  error: null;
  params:  NonNullable<S['params']>;
}

export function useAsync<T extends (...args: never[]) => Promise<unknown>>(asyncFn: T, {
  autoRunWithParams = undefined as undefined | Parameters<T>,
} = {}) {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null ,
    params: null,
  });

  const execute = (...params: Parameters<T>) => {
    setState({ status: "pending", params, data: null, error: null });
    asyncFn(...params)
      .then(data => setState({ params, status: "success", data: data as Awaited<ReturnType<T>>, error: null }))
      .catch(error => setState({ params, status: "error", data: null, error }));
  };

  useEffect(() => {
    if (autoRunWithParams) {
      execute(...autoRunWithParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFn]);

  return {
    ...state,
    execute,
  }
}
