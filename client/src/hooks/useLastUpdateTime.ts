import { useState, useEffect, useRef } from 'react';

export function useLastUpdateTime(unixTimestamp?: number) {
  const [label, setLabel] = useState('');
  const labelRef = useRef(label);

  useEffect(() => {
    labelRef.current = label;
  }, [label]);

  useEffect(() => {
    if (unixTimestamp == null) {
      setLabel('');
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const utsMs = unixTimestamp * 1000;

    function compute(nowMs: number) {
      const diffSecs = Math.floor((nowMs - utsMs) / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) {
        return {
          text: 'a few seconds ago',
          nextDelayMs: (60 - diffSecs) * 1000,
        };
      } else if (diffMins < 60) {
        const next = ((diffMins + 1) * 60 - diffSecs) * 1000;
        return {
          text: `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`,
          nextDelayMs: next,
        };
      } else if (diffHours < 24) {
        const next = ((diffHours + 1) * 3600 - diffSecs) * 1000;
        return {
          text: `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`,
          nextDelayMs: next,
        };
      } else {
        const next = ((diffDays + 1) * 86400 - diffSecs) * 1000;
        return {
          text: `${diffDays} day${diffDays === 1 ? '' : 's'} ago`,
          nextDelayMs: next,
        };
      }
    }

    function tick() {
      const { text, nextDelayMs } = compute(Date.now());
      if (text !== labelRef.current) setLabel(text);
      timer = setTimeout(tick, nextDelayMs);
    }

    tick();
    return () => clearTimeout(timer);
  }, [unixTimestamp]);

  return label;
}
