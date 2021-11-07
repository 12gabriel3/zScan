/* eslint-disable react/require-default-props */
import { ReactNode, useState, useEffect, useRef } from 'react';
import styles from './Resize.module.css';

interface Prop {
  children: ReactNode;
}

interface Horizontal extends Prop {
  direction: 'left' | 'right';
  maxWidth: number;
  minWidth: number;
}

interface Vertical extends Prop {
  direction: 'top' | 'bottom';
  maxHeight: number;
  minHeight: number;
}

export default function Resize(props: Vertical | Horizontal) {
  const { children, direction } = props;
  const subWindow = useRef<HTMLHeadingElement>(null);
  const [drag, setDrag] = useState(false);
  // const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(100);
  let minBound: number;
  let maxBound: number;
  let cssBounds: {
    minWidth: string;
    maxWidth: string;
    minHeight: string;
    maxHeight: string;
  };
  if ('minWidth' in props) {
    minBound = props.minWidth;
    maxBound = props.maxWidth;
    cssBounds = {
      minWidth: `${minBound}px`,
      maxWidth: `${maxBound}px`,
      minHeight: 'none',
      maxHeight: 'none',
    };
  } else {
    minBound = props.minHeight;
    maxBound = props.maxHeight;
    cssBounds = {
      minHeight: `${minBound}px`,
      maxHeight: `${maxBound}px`,
      minWidth: 'none',
      maxWidth: 'none',
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
        let mov: number;
        switch (direction) {
          case 'left':
            mov = -event.movementX;
            break;
          case 'right':
            mov = event.movementX;
            break;
          case 'bottom':
            mov = -event.movementY;
            break;
          case 'top':
            mov = event.movementY;
            break;
          default:
            break;
        }
        setWidth((w) => w + mov);
      }
    }
    function disableDrag() {
      setDrag(false);
      setWidth((w) => bound(w, minBound, maxBound));
    }
    document.addEventListener('mouseup', disableDrag);
    document.addEventListener('mousemove', move);
    return () => {
      document.removeEventListener('mouseup', disableDrag);
      document.removeEventListener('mousemove', move);
    };
  }, [drag, direction, minBound, maxBound]);

  return (
    <>
      {(direction === 'left' || direction === 'top') && (
        <div
          className={styles.draggable}
          onMouseDown={(event) => {
            event.stopPropagation();
            setDrag(true);
          }}
        />
      )}
      <div
        ref={subWindow}
        className={styles.window}
        style={{
          width: `${width}px`,
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
