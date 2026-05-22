import { useEffect, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

type AnimatedNumberProps = {
  value: number | null;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  duration = 0.4,
  className,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value ?? 0);
  const [displayValue, setDisplayValue] = useState(
    value !== null ? value.toLocaleString() : '-',
  );

  useEffect(() => {
    if (value === null) {
      setDisplayValue('-');
      motionValue.set(0);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest).toLocaleString());
      },
    });

    return () => controls.stop();
  }, [duration, motionValue, value]);

  return <span className={className}>{displayValue}</span>;
}
