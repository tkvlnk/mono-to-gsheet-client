import { useEffect, useMemo, useRef, useState } from "react";

export function useAppendScript(src: string) {
  const [scriptReady, { onLoad, onError }] = usePromiseProps();

  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    script.onerror = onError;

    document.body.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return scriptReady;
}

function usePromiseProps() {
  const onLoadRef = useRef<() => void>(() => {});
  const onErrorRef = useRef<(errorEvent: unknown) => void>(() => {});

  const [promise] = useState(
    () =>
      new Promise<void>((resolve, reject) => {
        onLoadRef.current = resolve;
        onErrorRef.current = reject;
      })
  );

  return [
    promise,
    useMemo(
      () => ({
        onLoad: () => onLoadRef.current(),
        onError: (errorEvent: unknown) => onErrorRef.current(errorEvent),
      }),
      []
    ),
  ] as const;
}
