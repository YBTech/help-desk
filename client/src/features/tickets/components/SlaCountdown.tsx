import { useState, useEffect, useRef } from 'react';
import { formatTimeRemaining } from '../../../shared/utils/formatters';
import styles from './SlaCountdown.module.css';

interface SlaCountdownProps {
  deadline: string;
  resolvedAt: string | null;
  closedAt: string | null;
}

export function SlaCountdown({ deadline, resolvedAt, closedAt }: SlaCountdownProps) {
  // 考点: state for timer value
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(deadline));
  // 考点: useRef to store interval ID
  const intervalRef = useRef<number | undefined>(undefined);

  // 考点: useEffect with interval and cleanup
  useEffect(() => {
    if (resolvedAt || closedAt) {
      return;
    }

    // 考点: setInterval for countdown
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(formatTimeRemaining(deadline));
    }, 1000);

    // 考点: cleanup function to prevent memory leaks
    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, [deadline, resolvedAt, closedAt]);

  // 考点: conditional rendering for completed state
  if (resolvedAt || closedAt) {
    return <div className={styles.completed}>Completed</div>;
  }

  const isBreached = timeRemaining === 'BREACHED';

  return (
    <div className={isBreached ? styles.breached : styles.countdown}>
      {timeRemaining}
    </div>
  );
}
