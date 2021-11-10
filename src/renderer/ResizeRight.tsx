/* eslint-disable react/require-default-props */
import { useState, useEffect, useRef } from 'react';
import { Prop } from './renderer';
import styles from './ResizeLeft.module.css';

interface ResizeProps extends Prop {
  className?: string;
}

export default function ResizeRight({ children, className = '' }: ResizeProps) {
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [drag, setDrag] = useState(false);
  const [size, setSize] = useState(0);

  useEffect(() => {
    function move(event: MouseEvent) {
      if (subWindow.current && drag && event.movementX)
        setSize(event.clientX - subWindow.current.getBoundingClientRect().x);
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
        ref={subWindow}
        className={`${styles.window} ${className}`}
        style={{ flexBasis: size ? `${size}px` : 'auto' }}
      >
        {children}
      </div>
      <div
        className={styles.draggable}
        onMouseDown={(event) => {
          event.stopPropagation();
          setDrag(true);
        }}
      />
    </>
  );
}
