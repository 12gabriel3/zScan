/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import Swagger from './APICLient';
import Tooltip from './Tooltip';

interface CorpPortraitProps {
  id: string;
}

export default function CorpPortrait({ id }: CorpPortraitProps) {
  const [corp, setCorp] = useState<any>(null);

  useEffect(() => {
    async function fetchCorporation(cId: string) {
      const client = await Swagger;
      const result =
        await client.apis.Corporation.get_corporations_corporation_id({
          corporation_id: cId,
        });
      setCorp(result.obj);
    }
    fetchCorporation(id);
  }, [id]);
  return (
    <div className="corpWrapper">
      <Tooltip content={corp?.name}>
        <img
          className="corporationImage"
          src={`https://images.evetech.net/corporations/${id}/logo?tenant=tranquility&size=32`}
          onDoubleClick={() =>
            window.electron.shell.openExternal(`https://zkillboard.com/corporation/${id}/`)
          }
        />
      </Tooltip>
    </div>
  );
}
