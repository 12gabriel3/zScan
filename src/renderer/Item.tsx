/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Item.module.css';
import { Prop } from './renderer';
import clickFile from '../../assets/click.wav';
import hoverFile from '../../assets/hover2.wav';

interface ItemProps extends Prop {
  onClick?: (id: string | number) => void;
  id?: number | string;
}

const click = new Audio(clickFile);
const hover = new Audio(hoverFile);

export default function Item({
  children,
  id = 0,
  // eslint-disable-next-line func-names
  onClick = function () {},
}: ItemProps) {
  return (
    <div
      tabIndex={0}
      className={styles.button}
      onClick={() => {
        onClick(id);
        click.play();
      }}
      onMouseEnter={() => hover.play()}
    >
      {children}
    </div>
  );
}
