import { DateTime, DurationLikeObject } from 'luxon';
import { useEffect, useState } from 'react';
import Swagger, { Zkill } from './APICLient';
import Columns from './Columns';
import Portrait from './Portrait';
import { Character } from './types';

interface InfoPageProps {
  character: Character;
}

export default function InfoPage({ character }: InfoPageProps) {
  const [pageInfo, setPageInfo] = useState<Character | null>(null);
  const [cyno, setCyno] = useState<boolean | undefined>(undefined);
  // const [kills, setKills] = useState([]);
  useEffect(() => {
    async function fetchPublicInfo(character_id: number) {
      const client = await Swagger;
      const result = await client.apis.Character.get_characters_character_id({
        character_id,
      }).catch(() => null);
      setPageInfo({ id: character_id, ...result.obj });
    }
    // async function fetchKillsList(character_id: number) {
    //   return (await Zkill.kills(character_id)).map((k: any) => {
    //     return { killmail_id: k.killmail_id, killmail_hash: k.zkb.hash };
    //   });
    // }
    async function fetchKM(id: any) {
      const client = await Swagger;
      return (
        await client.apis.Killmails.get_killmails_killmail_id_killmail_hash(id)
      ).obj;
    }
    async function fetchLossesList(character_id: number) {
      return (await Zkill.losses(character_id)).map((k: any) => {
        return { killmail_id: k.killmail_id, killmail_hash: k.zkb.hash };
      });
    }
    function isCyno(km: any, c: boolean | undefined){
      if (c) return c;
      const items: number[] = km.victim.items.map(
        (item: any) => item.item_type_id
      );
      if (items.includes(21096) || items.includes(28646)){
        console.log(km);
        return true;
      };
      return undefined;
    }

    async function calculateKMInfo(character_id: number) {
      const kmList = await fetchLossesList(character_id);
      setCyno(undefined);
      await Promise.all(
        kmList.reverse().map(async (km: any) => {
          const kill = await fetchKM(km);
          setCyno((c) => isCyno(kill, c));
          return kill;
        })
      ).catch(() => null);
      setCyno((c) => c === true);
    }

    if (character.id) {
      fetchPublicInfo(character.id);
      calculateKMInfo(character.id);
    }
  }, [character]);

  function toDuration(birthday: string, short = false): string {
    if (birthday) {
      birthday.trim();
      const date = DateTime.fromISO(birthday);
      const duration = DateTime.now().diff(date);
      const formats = [
        'year',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
      ];
      const conversion = {
        years: 'y',
        months: 'mo',
        weeks: 'w',
        days: 'd',
        hours: 'h',
        minutes: 'm',
        seconds: 's',
        milliseconds: 'ms',
      };
      const newDuration = duration.shiftTo(
        ...formats.map((v) => v.concat('s') as keyof DurationLikeObject)
      );
      const timeStrings: string[] = [];
      Object.entries(newDuration.toObject()).forEach(([key, value]) => {
        if (value)
          if (short)
            timeStrings.push(
              `${value}${conversion[key as keyof typeof conversion]}`
            );
          else
            timeStrings.push(
              `${value} ${value > 1 ? key : key.substring(0, key.length - 1)}`
            );
      });
      if (short) return `${timeStrings[0]} ${timeStrings[1]}`;
      return `${timeStrings[0]} and ${timeStrings[1]}`;
    }
    return '';
  }
  let cynoText = 'Loading...';
  if (cyno) cynoText = 'Is Cyno!';
  else if(cyno === false) cynoText = 'Not Cyno';
  return (
    pageInfo && (
      <Columns>
        <Portrait
          alliance_id={pageInfo.alliance_id}
          corporation_id={pageInfo.corporation_id}
          id={pageInfo.id}
        />
        <div className="horizontal">
          <div className="text">{pageInfo.name}</div>
          <div className="horizontal line" />
          <div className="text">
            {pageInfo.birthday ? toDuration(pageInfo.birthday) : ''}
          </div>
          <div className="text">{cynoText}</div>
        </div>
      </Columns>
    )
  );
}
