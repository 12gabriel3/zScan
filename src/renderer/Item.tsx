/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo } from 'react';
import { click, playHover } from './Audio';
import styles from './Item.module.css';

interface ItemProps {
  onClick: (char: string) => void;
  className?: string;
  characterName: string;
}
export default function Item({
  className = '',
  // eslint-disable-next-line func-names
  onClick,
  characterName,
}: ItemProps) {
  const audio = useMemo(() => new Audio(), []);
  return (
    <div
      tabIndex={0}
      className={styles.button}
      onMouseDown={() => {
        onClick(characterName);
        click.play();
      }}
      onMouseEnter={() => playHover(audio)}
    >
      <div className={`${styles.text} ${className || styles.highlight}`}>
        {characterName}
      </div>
      <div className={styles.margin} />
    </div>
  );
}
