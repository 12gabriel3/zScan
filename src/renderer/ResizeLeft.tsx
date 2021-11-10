/* eslint-disable react/require-default-props */
import { useState, useEffect, useRef } from 'react';
import { Prop } from './renderer';
import styles from './ResizeLeft.module.css';

interface ResizeProps extends Prop {
  className?: string;
}

export default function ResizeLeft({ children, className = '' }: ResizeProps) {
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [drag, setDrag] = useState(false);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    function move(event: MouseEvent) {
      if (subWindow.current && drag && event.movementX)
        setSize(
          subWindow.current.getBoundingClientRect().x -
            event.clientX +
            subWindow.current.getBoundingClientRect().width
        );
    }
    function disableDrag() {
      setDrag(false);
    }
    if (drag) {
      document.addEventListener('mouseup', disableDrag);
      document.addEventListener('mousemove', move);
    }
    return () => {
      document.removeEventListener('mouseup', disableDrag);
      document.removeEventListener('mousemove', move);
    };
  }, [drag]);

  return (
    <>
      <div
        className={styles.draggable}
        onMouseDown={(event) => {
          event.stopPropagation();
          setDrag(true);
        }}
      />
      <div
        ref={subWindow}
        className={`${styles.window} ${className}`}
        style={{ flexBasis: size !== null ? `${size}px` : 'auto' }}
      >
        {children}
      </div>
    </>
  );
}
