/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import API from './APICLient';
import Tooltip from './Tooltip';
import { Corporation } from './types';

interface CorpPortraitProps {
  id: number;
}

export default function CorpPortrait({ id }: CorpPortraitProps) {
  const [corp, setCorp] = useState<Corporation | null>(null);

  useEffect(() => {
    API.fetchCorporation(id)
      .then((c) => setCorp(c))
      .catch(() => null);
  }, [id]);
  return (
    <div className="corpWrapper">
      <Tooltip content={corp?.name || ''}>
        <img
          className="corporationImage"
          src={`https://images.evetech.net/corporations/${id}/logo?tenant=tranquility&size=32`}
          onDoubleClick={() =>
            window.electron.shell.openExternal(
              `https://zkillboard.com/corporation/${id}/`
            )
          }
        />
      </Tooltip>
    </div>
  );
}
