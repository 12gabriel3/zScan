/* eslint-disable jsx-a11y/media-has-caption */
// import { useEffect, useState } from 'react';
import Window from './Window';
import './Hello.css';
import SubWindow from './SubWindow';
import Wrapper from './Wrapper';
import Resize from './Resize';
import Item from './Item';

export default function Hello() {
  // const [text, setText] = useState('');

  // function clipboardSubscribe(callback: (text: string) => void) {
  //   let prev = '';
  //   return setInterval(() => {
  //     const curr = window.electron.clipboard.readText();
  //     if (curr !== prev) {
  //       prev = curr;
  //       callback(curr);
  //     }
  //   }, 100);
  // }

  // useEffect(() => {
  //   const timer = clipboardSubscribe((txt) => setText(txt));
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <Window>
      <Wrapper create="columns">
        <SubWindow>TAGS AND DETAILS</SubWindow>
        <Resize direction="left" minSize={10} maxSize={500}>
          <SubWindow>
            <Item>Characters</Item>
          </SubWindow>
        </Resize>
      </Wrapper>
    </Window>
  );
}
