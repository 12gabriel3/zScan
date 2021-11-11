/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import Swagger from './APICLient';
import { click, hover } from './Audio';
import styles from './Item.module.css';
import { Character } from './types';

interface ItemProps {
  onClick: (char: Character) => void;
  className?: string;
  CharacterName: string;
}

export default function Item({
  className = '',
  // eslint-disable-next-line func-names
  onClick,
  CharacterName,
}: ItemProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  useEffect(() => {
    async function fetchId(name: string) {
      const client = await Swagger;
      const result = await client.apis.Search.get_search({
        categories: 'character',
        search: name,
        strict: true,
      }).catch(() => null);
      if (result?.obj.character)
        setCharacter({ name, id: result.obj.character[0] });
      else setCharacter(null);
    }
    fetchId(CharacterName);
  }, [CharacterName]);
  return (
    character && (
      <div
        tabIndex={0}
        className={styles.button}
        onMouseDown={() => {
          onClick(character);
          click.play();
        }}
        onMouseEnter={() => hover.play()}
      >
        <div className={`${styles.highlight} ${className}`}>
          {CharacterName}
        </div>
        <div className={styles.margin} />
      </div>
    )
  );
}
