import { ReactElement, useEffect, useState } from 'react';
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
  const [characters, setCharacters] = useState<ReactElement[] | null>(null);
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
    function handleSelect(character: Character) {
      onSelect(character);
      setSelected(character);
    }
    function genList() {
      return clipboard.split('\n').reduce((list, name) => {
        const item = (
          <Item
            key={name}
            CharacterName={name}
            className={name === selected?.name ? 'selected' : ''}
            onClick={(char: Character) => handleSelect(char)}
          />
        );
        if (item) return list.concat(item);
        return list;
      }, [] as JSX.Element[]);
    }
    const chars = genList();
    if (chars.length) setCharacters(genList());
  }, [clipboard, onSelect, selected?.name]);

  return (
    (characters?.length && characters.length > 1 && (
      <ResizeLeft>
        <SubWindow className={styles.scrollable}>{characters}</SubWindow>
      </ResizeLeft>
    )) ||
    null
  );
}
