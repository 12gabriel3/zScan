import { useEffect, useState } from 'react';
import styles from './TooltipWindow.module.css';

interface Message {
  top: number;
  left: number;
  width: number;
  height: number;
  content: string;
}
export default function TooltipWindow() {
  const [show, setShow] = useState(false);
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
  });
  const [text, setText] = useState('');
  useEffect(() => {
    function setInfo(msg: Message) {
      const { top, left, width, content } = msg;
      setText(content);
      setDimensions({ top: top - 32, left: left + width / 2 });
      setShow(true);
    }
    window.electron.ipcRenderer.on('showtooltip', setInfo);
    window.electron.ipcRenderer.on('hidetooltip', () => setShow(false));
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${show && styles.show}`}
      style={dimensions}
    >
      <div className={`${styles.background}`}>
        <div className={styles.text}>{text}</div>
      </div>
      <div className={styles.topArrow}>
        <div className={styles.arrow} />
      </div>
    </div>
  );
}
