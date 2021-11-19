/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import API from './APICLient';
import Tooltip from './Tooltip';
import { Alliance } from './types';

interface AlliancePortraitProps {
  id: number;
}

export default function AlliancePortrait({ id }: AlliancePortraitProps) {
  const [alliance, setAlliance] = useState<Alliance | null>(null);

  useEffect(() => {
    API.fetchAlliance(id)
      .then((a) => setAlliance(a))
      .catch(() => null);
  }, [id]);

  return (
    <div className="allianceWrapper">
      <Tooltip content={alliance?.name || ''}>
        <img
          className="allianceImage"
          src={`https://images.evetech.net/alliances/${id}/logo?tenant=tranquility&size=32`}
          onDoubleClick={() =>
            window.electron.shell.openExternal(
              `https://zkillboard.com/alliance/${id}/`
            )
          }
        />
      </Tooltip>
    </div>
  );
}
