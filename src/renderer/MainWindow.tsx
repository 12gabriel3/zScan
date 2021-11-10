/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/media-has-caption */
import { ReactNode, useEffect, useState } from 'react';
import SwaggerClient from 'swagger-client';
import { DateTime, DurationLikeObject } from 'luxon';
import Window from './Window';
import './MainWindow.css';
import SubWindow from './SubWindow';
import ResizeLeft from './ResizeLeft';
import Columns from './Columns';
import Item from './Item';
import Tooltip from './Tooltip';

interface Character {
  id?: number;
  name: string;
  portrait?: ReactNode;
  birthday?: string;
  corporation_id?: string;
  alliance_id?: string;
}

const loading = (
  <div className="lds-ripple">
    <div />
    <div />
  </div>
);

const Swagger = SwaggerClient('https://esi.evetech.net/latest/swagger.json');

// image: `https://images.evetech.net/characters/${json.id[0]}/portrait?size=64`
// search: search/?categories=character&search=${v}&strict=true
// Gabriel Egdald
export default function MainWindow() {
  const [clipboard, setClipboard] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  function clipboardSubscribe(callback: (text: string) => void) {
    let prev = '';
    return setInterval(() => {
      const curr = window.electron.clipboard.readText();
      if (curr !== prev) {
        prev = curr;
        callback(curr);
      }
    }, 100);
  }

  useEffect(() => {
    const timer = clipboardSubscribe((txt) => setClipboard(txt));
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function updateCharacters(character: Character) {
      setCharacters((a) => {
        const c = a.concat();
        const index = c.findIndex((v) => v.name === character.name);
        if (index === -1) c.push(character);
        else c[index] = { ...c[index], ...character };
        return c;
      });
    }

    async function fetchId(name: string) {
      const client = await Swagger;
      const result = await client.apis.Search.get_search({
        categories: 'character',
        search: name,
        strict: true,
      }).catch(() => null);
      if (result && result.obj.character) return result.obj.character[0];
      return 0;
    }

    async function fetchPublicInfo(character_id: number) {
      const client = await Swagger;
      const result = await client.apis.Character.get_characters_character_id({
        character_id,
      }).catch(() => {
        return { birthday: null };
      });
      return result.obj;
    }

    async function fetchData() {
      const chars = clipboard.split('\n');
      // checks if the first element of the clipboard is a valid character
      const firstName = chars[0];
      const firstId = await fetchId(firstName);
      // if it is a valid character, send requests for the next characters
      if (firstId) {
        setCharacters([{ name: firstName, id: firstId }]);
        setSelected(firstName);
        const response = await fetchPublicInfo(firstId);
        updateCharacters({ name: firstName, ...response });
        if (chars.length > 1)
          chars.slice(1).forEach(async (name) => {
            if (name) {
              const id = await fetchId(name);
              updateCharacters({ name, id });
              const resp = await fetchPublicInfo(id);

              updateCharacters({
                name,
                ...resp,
              });
            }
          });
      }

    }

    fetchData();
  }, [clipboard]);

  function getItems() {
    characters.sort((a, b) => {
      if (a.name < b.name) return -1;
      return 1;
    });
    return characters.map((c) => (
      <Item
        className={c.name === selected ? 'selected' : ''}
        onClick={() => setSelected(c.name)}
      >
        {c.name}
      </Item>
    ));
  }

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

  function genPage(character: Character) {
    return (
      <Columns>
        <div className="portraits">
          {character.id ? (
            <Tooltip content={character.name}>
              <img
                className="characterImage"
                src={`https://images.evetech.net/characters/${character.id}/portrait?size=64`}
              />
            </Tooltip>
          ) : (
            loading
          )}
          <div className="corpWrapper">
            {character.corporation_id ? (
              <Tooltip content={character.name}>
                <img
                  className="corporationImage"
                  src={`https://images.evetech.net/corporations/${character.corporation_id}/logo?tenant=tranquility&size=32`}
                />
              </Tooltip>
            ) : null}
          </div>
          <div className="allianceWrapper">
            {character.alliance_id ? (
              <Tooltip content={character.name}>
                <img
                  className="allianceImage"
                  src={`https://images.evetech.net/alliances/${character.alliance_id}/logo?tenant=tranquility&size=32`}
                />
              </Tooltip>
            ) : null}
          </div>
        </div>
        <div className="horizontal">
          <div className="text">{character.name}</div>
          <div className="horizontal line" />
          <div className="text">
            {character.birthday ? toDuration(character.birthday) : ''}
          </div>
        </div>
      </Columns>
    );
  }

  const selectedChar =
    characters[characters.findIndex((c) => c.name === selected)];
  return (
    <Window>
      <Columns>
        <SubWindow className="white">
          {selectedChar ? genPage(selectedChar) : null}
        </SubWindow>
        {characters.length > 1 && (
          <ResizeLeft className="characters">
            <SubWindow className="window scrollable">{getItems()}</SubWindow>
          </ResizeLeft>
        )}
      </Columns>
    </Window>
  );
}
