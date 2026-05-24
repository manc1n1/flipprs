import { useEffect, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

type AnimatedNumberProps = {
  value: number | null;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
};

const defaultFormatter = (value: number) => value.toLocaleString();

export function AnimatedNumber({
  value,
  duration = 0.4,
  className,
  formatter = defaultFormatter,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value ?? 0);
  const [displayValue, setDisplayValue] = useState(
    value !== null ? formatter(value) : '-',
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
        setDisplayValue(formatter(Math.round(latest)));
      },
    });

    return () => controls.stop();
  }, [duration, formatter, motionValue, value]);

  return <span className={className}>{displayValue}</span>;
}
