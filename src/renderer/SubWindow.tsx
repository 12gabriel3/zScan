import { ReactNode, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SubWindow.module.css';

function SubWindow({
  resizable,
  children,
}: {
  resizable: 'left' | 'right' | 'top' | 'bottom' | undefined;
  children: ReactNode;
}) {
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [focused, setFocused] = useState(false);
  const [drag, setDrag] = useState(false);
  // const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(100);

  useEffect(() => {
    function bound(value: number, lower: number, upper: number){
      if (value > upper) return upper;
      if (value < lower) return lower;
      return value;
    }

    function move(event: MouseEvent) {
      if (drag) {
        const mov = resizable === 'left' ? -event.movementX : event.movementX;
        setWidth((w) => w + mov);
      }
    }
    function disableDrag() {
      setDrag(false);
      setWidth((w) => bound(w, 50, 180));
    }
    document.addEventListener('mouseup', disableDrag);
    document.addEventListener('mousemove', move);
    return () => {
      document.removeEventListener('mouseup', disableDrag);
      document.removeEventListener('mousemove', move);
    };
  }, [drag]);

  return (
    <>
      {resizable === 'left' && (
        <div
          className={styles.draggable}
          onMouseDown={() => {
            setDrag(true);
          }}
        />
      )}
      <div
        ref={subWindow}
        className={styles.window}
        tabIndex={0}
        style={{
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '0.4s',
          backgroundColor: focused
            ? 'rgba(66, 79, 92, 0.3)'
            : 'rgba(66, 79, 92, 0.1)',
          flex: resizable ? '0 0 auto' : '1',
          maxWidth: resizable ? '180px' : 'none',
          minWidth: resizable ? '50px' : 'none',
          width: `${width}px`,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
      {resizable === 'right' && (
        <div
          className={styles.draggable}
          onMouseDown={() => {
            setDrag(true);
          }}
        />
      )}
    </>
  );
}

SubWindow.propTypes = {
  resizable: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),

};
SubWindow.defaultProps = {
  resizable: false,
};
export default SubWindow;
