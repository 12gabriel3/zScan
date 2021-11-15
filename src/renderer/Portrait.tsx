/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/alt-text */
import AlliancePortrait from './AlliancePortrait';
import CorpPortrait from './CorpPortrait';
import styles from './Portrait.module.css';

interface PortraitProps {
  alliance_id?: string;
  corporation_id?: string;
  id: number;
}

export default function Portrait({
  alliance_id,
  corporation_id,
  id,
}: PortraitProps) {
  return (
    <div className={`${styles.img}`}>
      <img
        src={`https://images.evetech.net/characters/${id}/portrait?size=64`}
        onDoubleClick={() =>
          window.electron.shell.openExternal(
            `https://zkillboard.com/character/${id}/`
          )
        }
      />
      {corporation_id && <CorpPortrait id={corporation_id} />}
      {alliance_id && <AlliancePortrait id={alliance_id} />}
    </div>
  );
}
