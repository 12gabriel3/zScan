/* eslint-disable react/require-default-props */
import { useState, useEffect, useRef } from 'react';
import { Prop } from './renderer';
import styles from './ResizeTop.module.css';

interface ResizeProps extends Prop {
  className?: string;
}

export default function ResizeTop({ children, className = '' }: ResizeProps) {
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [drag, setDrag] = useState(false);
  const [size, setSize] = useState(-255);

  useEffect(() => {
    function move(event: MouseEvent) {
      if (subWindow.current && drag && event.movementY)
        setSize(
          subWindow.current.getBoundingClientRect().y -
            event.clientY +
            subWindow.current.getBoundingClientRect().height
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
        style={{ flexBasis: size !== -255 ? `${size}px` : 'auto' }}
      >
        {children}
      </div>
    </>
  );
}
