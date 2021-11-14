/* eslint-disable jsx-a11y/alt-text */
import styles from './Alert.module.css';

interface AlertProps {
  item_id: number;
  percentage: number;
}
export default function Alert({ item_id, percentage }: AlertProps) {
  return (
    <div
      className={styles.circular}
      style={{ opacity: percentage ? undefined : 0.3 }}
    >
      <div
        className={styles.icon}
        style={{
          filter: percentage ? undefined : 'grayscale()',
        }}
      >
        <img src={`https://image.eveonline.com/Type/${item_id}_32.png`} />
      </div>
      <div className={styles.inner} />
      <div className={styles.circle}>
        <div className={`${styles.bar} ${styles.left}`}>
          <div
            className={styles.progress}
            style={{
              transform: `rotate(${
                percentage > 50 ? ((percentage - 50) / 100) * 360 : 0
              }deg)`,
            }}
          />
        </div>
        <div className={`${styles.bar} ${styles.right}`}>
          <div
            className={styles.progress}
            style={{
              transform: `rotate(${Math.min(
                180,
                (percentage / 100) * 360
              )}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
