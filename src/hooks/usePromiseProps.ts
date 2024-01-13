import { useRef, useState, useMemo } from "react";

export function usePromiseProps() {
  const onLoadRef = useRef<() => void>(() => {});
  const onErrorRef = useRef<(errorEvent: unknown) => void>(() => {});

  const [promise] = useState(() => new Promise<void>((resolve, reject) => {
    onLoadRef.current = resolve;
    onErrorRef.current = reject;
  }));

  return [promise, useMemo(() => ({
    onLoad: () => onLoadRef.current(),
    onError: (errorEvent: unknown) => onErrorRef.current(errorEvent)
  }), [])] as const;
}
