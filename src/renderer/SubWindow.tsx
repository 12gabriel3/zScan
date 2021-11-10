/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { Prop } from './renderer';
import styles from './SubWindow.module.css';

interface SubWindowProps extends Prop {
  className?: string
}

function SubWindow({ children, className = '' }: SubWindowProps) {
  return (
    <div
      className={styles.window}
      tabIndex={0}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className={`${styles.content} ${className}`}>{children}</div>
      <div className={styles.glow} />
    </div>
  );
}

export default SubWindow;
