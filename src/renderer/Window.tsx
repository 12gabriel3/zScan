import { ReactNode, useEffect, useState } from 'react';
import styles from './Window.module.css';
import hover from '../../assets/hover.wav';

interface WindowProps {
  children: ReactNode;
}

export default function Window({ children }: WindowProps) {
  const audio = new Audio(hover);

  const [focused, setFocused] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.on('focus', () => setFocused(true));
    window.electron.ipcRenderer.on('unfocus', () => setFocused(false));
  }, []);

  const upperLeft = (style: React.CSSProperties) => (
    <svg
      className={styles.corner}
      style={{
        transform: style.transform,
        width: '3px',
        height: '3px',
        position: 'absolute',
        top: style.top,
        bottom: style.bottom,
        left: style.left,
        right: style.right,
      }}
    >
      <line
        className={styles.corner}
        x1="0"
        y1="0"
        x2="3"
        y2="0"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
      <line
        className={styles.corner}
        x1="0"
        y1="0"
        x2="0"
        y2="3"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
    </svg>
  );

  const corners = (
    <>
      {upperLeft({
        transform: 'none',
        top: 0,
        left: 0,
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '250ms',
        stroke: focused ? '#ffffffdd' : '#ffffffaa',
        strokeWidth: focused ? '3px' : '2px',
      })}
      {upperLeft({
        transform: 'rotate(180deg)',
        bottom: 0,
        right: 0,
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '0.4s',
        strokeWidth: focused ? '3px' : '2px',
        stroke: focused ? '#ffffffdd' : '#ffffffaa',
      })}
      {upperLeft({
        transform: 'rotate(-90deg)',
        bottom: 0,
        left: 0,
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '0.4s',
        strokeWidth: focused ? '3px' : '2px',
        stroke: focused ? '#ffffffdd' : '#ffffffaa',
      })}
      {upperLeft({
        transform: 'rotate(90deg)',
        top: 0,
        right: 0,
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '0.4s',
        strokeWidth: focused ? '3px' : '2px',
        stroke: focused ? '#ffffffdd' : '#ffffffaa',
      })}
    </>
  );

  return (
    <div
      className={styles.background}
      onMouseDown={() => window.electron.ipcRenderer.send('drag')}
      style={{
        backgroundColor: focused ? '#151617dd' : '#101112aa',
        transitionTimingFunction: focused ? 'linear' : 'ease-in',
        transitionDuration: focused ? '250ms' : '0.4s',
        borderColor: focused ? '#303235dd' : '#303235aa',
      }}
    >
      {corners}
      <div className={styles.banner}>
        <button
          type="button"
          onClick={() => window.electron.ipcRenderer.send('close')}
          onMouseEnter={() => audio.play()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <svg className={styles.button}>
            <line className={styles.button} x1="0" y1="1" x2="7" y2="8" />
            <line className={styles.button} x1="7" y1="1" x2="0" y2="8" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => window.electron.ipcRenderer.send('minimize')}
          onMouseEnter={() => audio.play()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <svg className={styles.button}>
            <line className={styles.button} x1="0" y1="7" x2="8" y2="7" />
          </svg>
        </button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
