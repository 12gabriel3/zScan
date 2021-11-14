import { useEffect, useState } from 'react';
import Swagger from './APICLient';
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
    async function fetchId(name: string) {
      const client = await Swagger;
      const result = await client.apis.Search.get_search({
        categories: 'character',
        search: name,
        strict: true,
      }).catch(() => null);
      if (result?.obj.character) {
        // { name, id: result.obj.character[0] }
        return { name, id: result.obj.character[0] };
      }
      return null;
    }
    async function getChars() {
      let cbFiltered: string[] = [
        clipboard.replaceAll(/[^a-zA-Z0-9_\-\n ]/g, ''),
      ];
      if (clipboard.includes('\n'))
        cbFiltered = clipboard
          .replaceAll(/[^a-zA-Z0-9_\-\n ]/g, '')
          .split('\n');
      cbFiltered = cbFiltered.filter((c) => c !== '');
      cbFiltered = [...new Set(cbFiltered)];
      const chars = await Promise.all(cbFiltered.map((c) => fetchId(c)));
      function notNull<T>(argument: T | null): argument is T {
        return argument !== null;
      }
      const filtered = chars.filter(notNull);
      if (filtered.length) setCharacters(filtered);
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
  const elements = characters.map(({ name, id }) => {
    return (
      <Item
        key={name}
        characterName={name}
        className={name === selected?.name ? styles.selected : ''}
        onClick={() => handleSelect({ name, id })}
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
