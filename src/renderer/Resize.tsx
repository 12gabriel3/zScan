/* eslint-disable react/require-default-props */
import { ReactNode, useState, useEffect, useRef } from 'react';
import styles from './Resize.module.css';

interface ResizeProps {
  children: ReactNode;
  direction: 'left' | 'right' | 'top' | 'bottom';
  maxSize: number;
  minSize: number;
}

export default function Resize({
  children,
  direction,
  maxSize,
  minSize,
}: ResizeProps) {
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [drag, setDrag] = useState(false);
  const [size, setSize] = useState((maxSize + minSize) / 2);
  let cssBounds: {
    minWidth: string;
    maxWidth: string;
    minHeight: string;
    maxHeight: string;
  };
  let cssDrag: {
    marginLeft: string;
    marginRight: string;
    marginTop: string;
    marginBottom: string;
    width?: string;
    height?: string;
    cursor: string;
  };

  if (direction === 'left' || direction === 'right') {
    cssBounds = {
      minWidth: `${minSize}px`,
      maxWidth: `${maxSize}px`,
      minHeight: 'none',
      maxHeight: 'none',
    };
    cssDrag = {
      marginLeft: '-3px',
      marginRight: '-3px',
      marginTop: '3px',
      marginBottom: '3px',
      width: '6px',
      cursor: 'w-resize',
    };
  } else {
    cssBounds = {
      minHeight: `${minSize}px`,
      maxHeight: `${maxSize}px`,
      minWidth: 'none',
      maxWidth: 'none',
    };
    cssDrag = {
      marginLeft: '3px',
      marginRight: '3px',
      marginTop: '-3px',
      marginBottom: '-3px',
      height: '6px',
      cursor: 'n-resize',
    };
  }

  useEffect(() => {
    function bound(value: number, lower: number, upper: number) {
      if (value > upper) return upper;
      if (value < lower) return lower;
      return value;
    }

    function move(event: MouseEvent) {
      if (drag) {
        switch (direction) {
          case 'left':
            setSize((s) => s - event.movementX);
            break;
          case 'right':
            setSize((s) => s + event.movementX);
            break;
          case 'bottom':
            setSize((s) => s + event.movementY);
            break;
          case 'top':
            setSize((s) => s - event.movementY);
            break;
          default:
            break;
        }
      }
    }
    function disableDrag() {
      setDrag(false);
      setSize((s) => bound(s, minSize, maxSize));
    }
    document.addEventListener('mouseup', disableDrag);
    document.addEventListener('mousemove', move);
    return () => {
      document.removeEventListener('mouseup', disableDrag);
      document.removeEventListener('mousemove', move);
    };
  }, [drag, direction, minSize, maxSize]);

  return (
    <>
      {(direction === 'left' || direction === 'top') && (
        <div
          className={styles.draggable}
          onMouseDown={(event) => {
            event.stopPropagation();
            setDrag(true);
          }}
          style={cssDrag}
        />
      )}
      <div
        ref={subWindow}
        className={styles.window}
        style={{
          flex: `0 0 ${size}px`,
          ...cssBounds,
        }}
      >
        {children}
      </div>
      {(direction === 'right' || direction === 'bottom') && (
        <div
          className={styles.draggable}
          onMouseDown={(event) => {
            event.stopPropagation();
            setDrag(true);
          }}
        />
      )}
    </>
  );
}
