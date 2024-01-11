import { useEffect } from "react";
import { usePromiseProps } from "./usePromiseProps";

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
