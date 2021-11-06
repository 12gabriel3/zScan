/* eslint-disable jsx-a11y/media-has-caption */
// import { useEffect, useState } from 'react';
import Window from './Window';
import './Hello.css';
import SubWindow from './SubWindow';

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
      <div className="wrapper">
        <SubWindow>TAGS AND DETAILS</SubWindow>
        <SubWindow resizable="left">CHARACTERS</SubWindow>
      </div>
    </Window>
  );
}
