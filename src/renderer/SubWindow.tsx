/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { ReactNode } from 'react';
import styles from './SubWindow.module.css';

function SubWindow({ children }: { children: ReactNode }) {
  return (
    <div
      className={styles.window}
      tabIndex={0}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className={styles.content}>{children}</div>
      <div className={styles.glow} />
    </div>
  );
}

export default SubWindow;
