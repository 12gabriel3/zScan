/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import Frame from './Frame';
import './Hello.css';

export default class Hello extends React.Component<unknown, { text: string }> {
  timerID: NodeJS.Timer | undefined;

  constructor(props: any) {
    super(props);
    this.state = { text: window.electron.clipboard.readText() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.readClipboard(), 1000);
  }

  readClipboard() {
    this.setState({ text: window.electron.clipboard.readText() });
  }

  render() {
    const { text } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative'}}>
        <Frame />
        <div style={{ position: 'absolute', top: '20px', left: '0', right:'0', bottom: '0',  display: 'flex'}}>
          <div className="left">{text}</div>
          <div
            className="right"
            onMouseDown={() => window.electron.ipcRenderer.send('drag')}
          />
        </div>
      </div>
    );
  }
}
