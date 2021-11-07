import styles from './Window.module.css';
import hover from '../../assets/hover.wav';
import { Prop } from './renderer';

const audio = new Audio(hover);
export default function Window({ children }: Prop) {
  const corners = (
    <>
      <svg className={`${styles.top} ${styles.corner} ${styles.left}`}>
        <line className={styles.corner} x1="0" y1="0" x2="3" y2="0" />
        <line className={styles.corner} x1="0" y1="0" x2="0" y2="3" />
      </svg>
      <svg className={`${styles.top} ${styles.corner} ${styles.right}`}>
        <line className={styles.corner} x1="0" y1="0" x2="3" y2="0" />
        <line className={styles.corner} x1="3" y1="0" x2="3" y2="3" />
      </svg>
      <svg className={`${styles.bottom} ${styles.corner} ${styles.left}`}>
        <line className={styles.corner} x1="0" y1="3" x2="3" y2="3" />
        <line className={styles.corner} x1="0" y1="3" x2="0" y2="0" />
      </svg>
      <svg className={`${styles.bottom} ${styles.corner} ${styles.right}`}>
        <line className={styles.corner} x1="3" y1="3" x2="3" y2="0" />
        <line className={styles.corner} x1="3" y1="3" x2="0" y2="3" />
      </svg>
    </>
  );

  return (
    <div
      tabIndex={0}
      className={styles.background}
      onMouseDown={() => window.electron.ipcRenderer.send('drag')}
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
