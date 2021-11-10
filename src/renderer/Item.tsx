/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Item.module.css';
import { Prop } from './renderer';
import clickFile from '../../assets/click.wav';
import hoverFile from '../../assets/hover2.wav';

interface ItemProps extends Prop {
  onClick?: () => void;
  className?: string;
}

const click = new Audio(clickFile);
const hover = new Audio(hoverFile);

export default function Item({
  children,
  className = '',
  // eslint-disable-next-line func-names
  onClick = function () {},
}: ItemProps) {
  return (
    <div
      tabIndex={0}
      className={styles.button}
      onMouseDown={() => {
        onClick();
        click.play();
      }}
      onMouseEnter={() => hover.play()}
    >
      <div className={`${styles.highlight} ${className}`}>{children}</div>
      <div className={styles.margin} />
    </div>
  );
}
