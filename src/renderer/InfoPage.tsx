import { DateTime, DurationLikeObject } from 'luxon';
import { useEffect, useState } from 'react';
import Swagger from './APICLient';
import Columns from './Columns';
import Portrait from './Portrait';
import { Character } from './types';

interface InfoPageProps {
  character: Character;
}

export default function InfoPage({ character }: InfoPageProps) {
  const [pageInfo, setPageInfo] = useState<Character | null>(null);
  useEffect(() => {
    async function fetchPublicInfo(character_id: number) {
      const client = await Swagger;
      const result = await client.apis.Character.get_characters_character_id({
        character_id,
      }).catch(() => null);
      setPageInfo({ id: character_id, ...result.obj });
    }
    if (character.id) fetchPublicInfo(character.id);
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
          id={pageInfo.id}
        />
        <div className="horizontal">
          <div className="text">{pageInfo.name}</div>
          <div className="horizontal line" />
          <div className="text">
            {pageInfo.birthday ? toDuration(pageInfo.birthday) : ''}
          </div>
        </div>
      </Columns>
    )
  );
}
