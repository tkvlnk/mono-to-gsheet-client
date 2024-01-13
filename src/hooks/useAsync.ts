import { useEffect, useState } from "react";

export type AsyncState<T extends (...args: never[]) => Promise<unknown>> = {
  status: "idle" | "pending" | "success" | "error";
  data: null | Awaited<ReturnType<T>>;
  error: null | string;
  params: null | Parameters<T>;
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

  const execute = async (...params: Parameters<T>) => {
    setState({ status: "pending", params, data: null, error: null });
    try {
      const data = await asyncFn(...params);
      setState(prev => ({ ...prev, status: "success", data: data as Awaited<ReturnType<T>>, error: null }))
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, status: "error", data: null, error: error.message }));
    }
  };

  useEffect(() => {
    if (autoRunWithParams) {
      execute(...autoRunWithParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    execute,
  }
}
