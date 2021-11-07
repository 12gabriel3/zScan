import { ReactNode } from 'react';
import styles from './Wrapper.module.css';

interface WrapperProps {
  children: ReactNode;
  create: 'columns' | 'rows';
}

export default function Wrapper({ children, create = 'rows' }: WrapperProps) {
  let flow: string;
  if (create === 'columns') flow = 'row';
  else flow = 'column';

  return (
    <div className={styles.wrapper} style={{ flexFlow: flow }}>
      {children}
    </div>
  );
}
