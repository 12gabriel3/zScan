/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import Frame from './Frame';

export default class Hello extends React.Component<unknown, { text: string }> {
  timerID: NodeJS.Timer = setInterval(() => this.readClipboard(), 1000);

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
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Frame />
        <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
          {text}
        </div>
      </div>
    );
  }
}
