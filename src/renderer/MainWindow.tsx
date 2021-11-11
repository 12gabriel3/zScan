/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/media-has-caption */
import { useState } from 'react';
import Window from './Window';
import './MainWindow.css';
import SubWindow from './SubWindow';
import Columns from './Columns';
import { Character } from './types';
import CharList from './CharList';
import InfoPage from './InfoPage';

// image: `https://images.evetech.net/characters/${json.id[0]}/portrait?size=64`
// search: search/?categories=character&search=${v}&strict=true
// Gabriel Egdald
export default function MainWindow() {
  const [selected, setSelected] = useState<Character | null>(null);
  return (
    <Window>
      <Columns>
        <SubWindow className="white">
          {selected && <InfoPage character={selected} />}
        </SubWindow>
        <CharList onSelect={(char) => setSelected(char)} />
      </Columns>
    </Window>
  );
}
