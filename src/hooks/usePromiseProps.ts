import { useRef, useState, useMemo } from "react";

export function usePromiseProps() {
  const onLoadRef = useRef<() => void>(() => {});
  const onErrorRef = useRef<(errorEvent: unknown) => void>(() => {});

  const [promise] = useState(new Promise<void>((resolve, reject) => {
    onLoadRef.current = resolve;
    onErrorRef.current = reject;
  }));

  return [promise, useMemo(() => ({
    onLoad: () => {console.log('yes');onLoadRef.current()},
    onError: (errorEvent: unknown) => {console.log('no', errorEvent);onErrorRef.current(errorEvent)}
  }), [])] as const;
}
