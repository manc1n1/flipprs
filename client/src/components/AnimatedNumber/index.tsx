import { useEffect, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  duration = 0.4,
  className,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [duration, motionValue, value]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}
