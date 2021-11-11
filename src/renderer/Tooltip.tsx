import { useRef } from 'react';
import { Prop } from './renderer';
import styles from './Tooltip.module.css';

interface TooltipProps extends Prop {
  content: string;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  className,
}: TooltipProps) {
  const ref = useRef<HTMLInputElement>(null);
  function sendInfo() {
    const rect = ref?.current?.getBoundingClientRect();
    const { width, height, x, y } = rect || { width: 0, height: 0, x: 0, y: 0 };
    window.electron.ipcRenderer.send('showtooltip', {
      width,
      height,
      left: x,
      top: y,
      content,
    });
  }
  return (
    <div
      ref={ref}
      className={`${styles.tooltip} ${className}`}
      onMouseEnter={sendInfo}
      onMouseLeave={() => window.electron.ipcRenderer.send('hidetooltip')}
    >
      {children}
    </div>
  );
}
