import { useEffect, useMemo, useRef } from 'react';

type Timeout = ReturnType<typeof setTimeout>;

export function useDebouncedCallback(
  fn: (val: string) => void,
  delay = 200,
): (val: string) => void {
  const fnRef = useRef(fn);
  const timeoutRef = useRef<Timeout | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debounced = useMemo(() => {
    const d = (val: string) => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fnRef.current(val), delay);
    };
    return d;
  }, [delay]);

  return debounced;
}
