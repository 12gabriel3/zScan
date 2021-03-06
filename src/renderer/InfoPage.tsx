import { DateTime, DurationLikeObject } from 'luxon';
import { useEffect, useState } from 'react';
import Alert from './Alert';
import API from './APICLient';
import Columns from './Columns';
import Portrait from './Portrait';
import Tooltip from './Tooltip';
import { Character } from './types';

interface InfoPageProps {
  character: Character;
}
// interface Classification {
//   name: string;
//   score: number;
// }
// interface ClassificationDef {
//   name: string;
//   modules: number[];
//   ships: number[];
//   weight: number;
// }

// window.electron.store.get('classifications');
const ONEMONTH = 2592000000;

export default function InfoPage({ character }: InfoPageProps) {
  const [pageInfo, setPageInfo] = useState<Character | null>(null);
  const [cynoScore, setCynoScore] = useState<number>(0);
  const [dictorScore, setDictorScore] = useState<number>(0);
  // const [kills, setKills] = useState([]);
  useEffect(() => {
    async function fetchPublicInfo(character_id: number) {
      setPageInfo(await API.fetchCharacter(character_id));
    }
    // async function fetchKillsList(character_id: number) {
    //   return (await Zkill.kills(character_id)).map((k: any) => {
    //     return { killmail_id: k.killmail_id, killmail_hash: k.zkb.hash };
    //   });
    // }
    function isCyno(km: any) {
      const items: number[] = km.victim.items.map(
        (item: any) => item.item_type_id
      );
      if (items.includes(21096) || items.includes(28646)) {
        return true;
      }
      return false;
    }
    function isDictor(km: any) {
      const items: number[] = km.victim.items.map(
        (item: any) => item.item_type_id
      );
      if (items.includes(22782)) {
        return true;
      }
      return false;
    }

    function isShip(km: any) {
      const ship = km.victim.items.item_type_id;
      if (ship === 670) return false;
      if (km.victim.items.length === 0) return false;
      return true;
    }

    async function calculateKMInfo(character_id: number) {
      const lossesList = await API.fetchLossesIds(character_id);
      let cyno = 0;
      let dictor = 0;
      let totalLosses = 0;
      await Promise.all(
        lossesList.reverse().map(async (km: any) => {
          const kill = await API.fetchKM(km);
          if (isShip(kill)) {
            const timeFromNow =
              DateTime.now().toMillis() -
              DateTime.fromISO(kill.killmail_time).toMillis();
            if (timeFromNow <= ONEMONTH * 3) {
              if (isCyno(kill)) cyno += 1;
              if (isDictor(kill)) dictor += 1;
              totalLosses += 1;
              setCynoScore(
                ((cyno * 10) / (totalLosses + cyno * (10 - 1))) * 100
              );
              setDictorScore(
                ((dictor * 10) / (totalLosses + dictor * (10 - 1))) * 100
              );
            }
          }
          return kill;
        })
      ).catch(() => null);
      if (totalLosses === 0) {
        setCynoScore(0);
        setDictorScore(0);
      }
    }

    if (character.character_id) {
      fetchPublicInfo(character.character_id);
      calculateKMInfo(character.character_id);
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
  return (
    pageInfo && (
      <Columns>
        <Portrait
          alliance_id={pageInfo.alliance_id}
          corporation_id={pageInfo.corporation_id}
          id={pageInfo.character_id}
        />
        <div className="horizontal">
          <div className="text">{pageInfo.name}</div>
          <div className="horizontal line" />
          <div className="text">
            {pageInfo.birthday ? toDuration(pageInfo.birthday) : ''}
          </div>
          <Tooltip content={`${Math.round(cynoScore)}% cyno`}>
            <Alert item_id={21096} percentage={cynoScore} />
          </Tooltip>
          <Tooltip content={`${Math.round(dictorScore)}% dictor`}>
            <Alert item_id={22782} percentage={dictorScore} />
          </Tooltip>
        </div>
      </Columns>
    )
  );
}
