/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { ReactNode, useState } from 'react';
import styles from './SubWindow.module.css';

function SubWindow({ children }: { children: ReactNode }) {
  const [focused, setFocused] = useState(false);
  // const [height, setHeight] = useState(100);

  return (
    <div
      className={styles.window}
      tabIndex={0}
      style={{
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '0.4s',
        backgroundColor: focused
          ? 'rgba(66, 79, 92, 0.3)'
          : 'rgba(66, 79, 92, 0.1)',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className={styles.content}>{children}</div>
      <div
        className={styles.glow}
        style={{
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDelay: focused ? '150ms' : '0',
          opacity: focused ? 1 : 0.3,
        }}
      />
    </div>
  );
}

export default SubWindow;
