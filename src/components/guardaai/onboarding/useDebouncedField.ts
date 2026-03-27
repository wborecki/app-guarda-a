import { useState, useEffect, useRef, useCallback } from "react";

export const useDebouncedField = (
  initialValue: string,
  onSave: (val: string) => void,
  delay = 800
) => {
  const [local, setLocal] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const prevInit = useRef(initialValue);
  useEffect(() => {
    if (initialValue !== prevInit.current) {
      setLocal(initialValue);
      prevInit.current = initialValue;
    }
  }, [initialValue]);

  const onChange = useCallback((val: string) => {
    setLocal(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSaveRef.current(val), delay);
  }, [delay]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return [local, onChange] as const;
};
