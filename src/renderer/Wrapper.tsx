import { ReactNode } from 'react';
import styles from './Wrapper.module.css';

interface WrapperProps {
  children: ReactNode;
  direction: 'column' | 'row';
}

export default function Wrapper({ children, direction = 'row' }: WrapperProps) {
  return (
    <div className={styles.wrapper} style={{ flexFlow: direction }}>
      {children}
    </div>
  );
}
