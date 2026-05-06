import { useCallback, useEffect, useRef } from 'react';
import { defaultPatterns, WebHaptics } from 'web-haptics';

type TTriggerArg =
  | number
  | string
  | (typeof defaultPatterns)[keyof typeof defaultPatterns]
  | Array<{ duration: number; intensity?: number }>;

export interface IHapticsOptions {
  debug?: boolean;
}

export interface IHapticsResult {
  isReady: boolean;
  trigger: (pattern: TTriggerArg) => Promise<void>;
  cancel: () => void;

  error: () => void;
  success: () => void;
  selection: () => void;
}

export function useHaptics(options: IHapticsOptions = {}): IHapticsResult {
  const hapticsRef = useRef<WebHaptics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    hapticsRef.current = new WebHaptics({ debug: !!options.debug });

    return () => {
      hapticsRef.current?.destroy();
      hapticsRef.current = null;
    };
  }, [options.debug]);

  const trigger = useCallback(async (pattern: TTriggerArg) => {
    await hapticsRef.current?.trigger(pattern);
  }, []);

  const cancel = useCallback(() => {
    hapticsRef.current?.cancel?.();
  }, []);

  const error = useCallback(() => {
    void hapticsRef.current?.trigger(defaultPatterns.error);
  }, []);

  const success = useCallback(() => {
    void hapticsRef.current?.trigger(defaultPatterns.success);
  }, []);

  const selection = useCallback(() => {
    void hapticsRef.current?.trigger(defaultPatterns.selection);
  }, []);

  return {
    isReady: !!hapticsRef.current,
    trigger,
    cancel,
    error,
    success,
    selection,
  };
}
