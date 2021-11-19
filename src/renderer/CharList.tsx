import { useEffect, useState } from 'react';
import API from './APICLient';
import styles from './CharList.module.css';
import Item from './Item';
import ResizeLeft from './ResizeLeft';
import SubWindow from './SubWindow';
import { Character } from './types';

interface CharListProps {
  onSelect: (a: Character) => void;
}

export default function CharList({ onSelect }: CharListProps) {
  const [clipboard, setClipboard] = useState('');
  const [selected, setSelected] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    async function getChars() {
      let cbFiltered: string[] = [];
      if (clipboard.includes('</url>')) {
        cbFiltered = clipboard
          .replaceAll('\n', '')
          .split('>')
          .slice(1)
          .join('>')
          .split('</url>')
          .filter((v) => v.length > 1)
          .map((v) => {
            const match = v.match(/(?<=\/\/)(.*?)(?=>)/);
            if (
              match &&
              parseInt(match[0], 10) > 90000000 &&
              parseInt(match[0], 10) < 2147483647
            ) {
              return v.split('>')[1];
            }
            return '';
          })
          .filter((v) => v.length > 1);
      } else {
        cbFiltered = [clipboard.replaceAll(/[^a-zA-Z0-9_\-\n ]/g, '')];
        if (clipboard.includes('\n'))
          cbFiltered = clipboard
            .replaceAll(/[^a-zA-Z0-9_\-\n ]/g, '')
            .split('\n');
      }
      cbFiltered = cbFiltered.filter((c) => c !== '');
      cbFiltered = [...new Set(cbFiltered)];
      const first = await API.fetchCharacterId(cbFiltered[0]);
      if (first) setCharacters([first]);
      cbFiltered.slice(1).forEach(async (c) => {
        const id = await API.fetchCharacterId(c);
        if (id)
          setCharacters((chars) =>
            chars.concat(id).sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              return 1;
            })
          );
      });
    }
    getChars();
  }, [clipboard]);

  function handleSelect(character: Character) {
    onSelect(character);
    setSelected(character);
  }

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
  const elements = characters.map(({ name, character_id: id }) => {
    return (
      <Item
        key={name}
        characterName={name}
        className={name === selected?.name ? styles.selected : ''}
        onClick={() => handleSelect({ name, character_id: id })}
      />
    );
  });
  if (characters.length === 1) onSelect(characters[0]);
  return (
    (elements?.length && (
      <ResizeLeft
        className={`${styles.characters} ${
          elements.length === 1 && styles.hidden
        }`}
      >
        <SubWindow className={`${styles.scrollable} `}>{elements}</SubWindow>
      </ResizeLeft>
    )) ||
    null
  );
}
