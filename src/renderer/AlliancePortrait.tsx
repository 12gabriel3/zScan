/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import Swagger from './APICLient';
import Tooltip from './Tooltip';

interface AlliancePortraitProps {
  id: string;
}

export default function AlliancePortrait({ id }: AlliancePortraitProps) {
  const [alliance, setAlliance] = useState<any>(null);

  useEffect(() => {
    async function fetchAlliance(aId: string) {
      const client = await Swagger;
      const result = await client.apis.Alliance.get_alliances_alliance_id({
        alliance_id: aId,
      });
      setAlliance(result.obj);
    }
    fetchAlliance(id);
  }, [id]);

  return (
    <div className="allianceWrapper">
      <Tooltip content={alliance?.name}>
        <img
          className="allianceImage"
          src={`https://images.evetech.net/alliances/${id}/logo?tenant=tranquility&size=32`}
        />
      </Tooltip>
    </div>
  );
}
